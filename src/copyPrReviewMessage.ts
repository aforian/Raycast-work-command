import { showHUD, Clipboard, getPreferenceValues, getFrontmostApplication } from '@raycast/api';
import escapeStringAppleScript from 'escape-string-applescript';

import { getActiveTabUrl, getTextFromActiveTab } from './utils/getActiveTabUrl';
import { buildLink } from './utils/buildLink';

interface CommandArguments {
  message: string;
}

function isMissing(content: string) {
  return content === 'missing value';
}

export default async function copyPrReviewMessage(props: { arguments: CommandArguments }) {
  try {
    const { bitbucketWorkspace } = getPreferenceValues();
    const frontmostApp = await getFrontmostApplication();
    const { name: appName } = frontmostApp;
    const { message } = props.arguments;

    const url = await getActiveTabUrl(appName);

    if (!url) {
      return showHUD('URL not found');
    }

    if (!url.href.startsWith(bitbucketWorkspace) || !url.href.includes('pull-requests')) {
      throw new Error('Not a pull request.');
    }
    const cartNameScript = escapeStringAppleScript(
      'document.querySelector(\'[data-module-key="dvcs-connector-issue-key-linker"]\').innerText'
    );
    const cartLinkScript = escapeStringAppleScript(
      'document.querySelector(\'[data-module-key="dvcs-connector-issue-key-linker"]\').href'
    );

    const cardName = await getTextFromActiveTab(cartNameScript, appName);
    const cardLink = await getTextFromActiveTab(cartLinkScript, appName);

    const cardContent = !isMissing(cardName) && !isMissing(cardLink) ? buildLink(cardLink, cardName) : '';
    const messageContent = message.replace(' ', '') !== '' ? `${message}，` : '';

    await Clipboard.copy({
      html: `
        Hi team，${messageContent}再麻煩大家幫看 :pray: <br/>
        ${cardContent}${cardContent ? ' | ' : ''}${buildLink(url.href, 'PR')}
      `,
    });
    await showHUD('PR review message copied');
  } catch (error) {
    if (error instanceof Error) {
      await showHUD(`Error: ${error.message}`);
    }
  }
}
