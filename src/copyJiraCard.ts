import { showHUD, Clipboard, getPreferenceValues } from '@raycast/api';
import { buildLink } from './utils/buildLink';

import { getTabUrlFromChrome } from './utils/getTabUrlFromChrome';

export default async function copyJiraCard() {
  try {
    const { atlassianDomain } = getPreferenceValues();
    const url = await getTabUrlFromChrome();

    if (!url.startsWith(atlassianDomain) || !url.includes('/browse/')) {
      throw new Error('Not a Jira card');
    }

    const cardName = url.split('/').pop();

    await Clipboard.copy({ html: buildLink(url, cardName) });
    await showHUD('Copied Card to clipboard');
  } catch (error) {
    if (error instanceof Error) {
      await showHUD(`Error: ${error.message}`);
    }
  }
}
