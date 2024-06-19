import { showHUD, Clipboard, getPreferenceValues, getFrontmostApplication } from '@raycast/api';
import { buildLink } from './utils/buildLink';

import { getActiveTabUrl } from './utils/getActiveTabUrl';

export default async function copyJiraCard() {
  try {
    const { atlassianDomain } = getPreferenceValues();
    const frontmostApp = await getFrontmostApplication();
    const { name: appName } = frontmostApp;
    const url = await getActiveTabUrl(appName);

    if (!url) {
      throw new Error('URL not found');
    }

    if (!url.href.startsWith(atlassianDomain) || !url.href.includes('/browse/')) {
      throw new Error('Not a Jira card');
    }

    const cardName = url.href.split('/').pop();

    await Clipboard.copy({ html: buildLink(url.href, cardName) });
    await showHUD('Copied Card to clipboard');
  } catch (error) {
    if (error instanceof Error) {
      await showHUD(`Error: ${error.message}`);
    }
  }
}
