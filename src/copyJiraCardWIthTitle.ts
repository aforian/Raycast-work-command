import { showHUD, Clipboard, getPreferenceValues } from '@raycast/api';
import { buildLink } from './utils/buildLink';
import { getTabUrlFromChrome, getTextFromActiveTab } from './utils/getTabUrlFromChrome';

function getPageTitle() {
  return getTextFromActiveTab(`
    document.querySelector('h1')?.innerText ?? document.querySelector('title')?.innerText ?? '';
  `);
}

export default async function copyJiraCardWithTitle() {
  const { atlassianDomain } = getPreferenceValues();
  const url = await getTabUrlFromChrome();
  let pageTitle = await getPageTitle();
  let toastText = 'Copied Link to clipboard';

  if (url.startsWith(atlassianDomain) && !url.includes('wiki')) {
    const cardName = url.split('/').pop();

    pageTitle = `${cardName} ${pageTitle}`;
    toastText = 'Copied Card to clipboard';
  }

  await Clipboard.copy({ html: buildLink(url, pageTitle) });
  await showHUD(toastText);
}
