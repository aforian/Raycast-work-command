import { showHUD, Clipboard, getPreferenceValues, getFrontmostApplication } from '@raycast/api';
import { buildLink } from './utils/buildLink';
import { getActiveTabUrl, getTextFromActiveTab } from './utils/getActiveTabUrl';

function getPageTitle(browser: string) {
  return getTextFromActiveTab(
    "document.querySelector('h1')?.innerText ?? document.querySelector('title')?.innerText ?? '';",
    browser
  );
}

const quotePattern = /^"(.*)"$/;

export default async function copyJiraCardWithTitle() {
  const frontmostApplication = await getFrontmostApplication();
  const { name: appName } = frontmostApplication;
  const { atlassianDomain } = getPreferenceValues();
  const url = await getActiveTabUrl(appName);

  if (!url) {
    return;
  }

  let pageTitle = await getPageTitle(appName);
  let toastText = 'Copied Link to clipboard';

  if (pageTitle.match(quotePattern)) {
    pageTitle = pageTitle.replace(quotePattern, '$1');
  }

  if (url.href.startsWith(atlassianDomain) && !url.href.includes('wiki')) {
    const cardName = url.href.split('/').pop();
    console.log('page title', pageTitle);

    pageTitle = `${cardName} ${pageTitle}`;
    toastText = 'Copied Card to clipboard';
    console.log('page title', pageTitle);
  }

  await Clipboard.copy({ html: buildLink(url.href, pageTitle) });
  await showHUD(toastText);
}
