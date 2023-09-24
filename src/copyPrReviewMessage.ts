import { showHUD, Clipboard, getPreferenceValues } from '@raycast/api';
import escapeStringAppleScript from 'escape-string-applescript';

import { getTabUrlFromChrome, getTextFromActiveTab } from './utils/getTabUrlFromChrome';
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
    const { message } = props.arguments;

    const PrUrl = await getTabUrlFromChrome();
    if (!PrUrl.startsWith(bitbucketWorkspace) || !PrUrl.includes('pull-requests')) {
      throw new Error('Not a pull request.');
    }
    const cartNameScript = escapeStringAppleScript(
      'document.querySelector(\'[data-module-key="dvcs-connector-issue-key-linker"]\').innerText'
    );
    const cartLinkScript = escapeStringAppleScript(
      'document.querySelector(\'[data-module-key="dvcs-connector-issue-key-linker"]\').href'
    );

    const cardName = await getTextFromActiveTab(cartNameScript);
    const cardLink = await getTextFromActiveTab(cartLinkScript);

    const cardContent = !isMissing(cardName) && !isMissing(cardLink) ? buildLink(cardLink, cardName) : '';
    const messageContent = message.replace(' ', '') !== '' ? `${message}，` : '';

    await Clipboard.copy({
      html: `
        Hi team，${messageContent}再麻煩大家幫看 :pray: <br/>
        ${cardContent}${cardContent ? ' | ' : ''}${buildLink(PrUrl, 'PR')}
      `,
    });
    await showHUD('PR review message copied');
  } catch (error) {
    if (error instanceof Error) {
      await showHUD(`Error: ${error.message}`);
    }
  }
}
