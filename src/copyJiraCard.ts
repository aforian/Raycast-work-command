import { showHUD, Clipboard, showToast, Toast } from "@raycast/api";
import { getTabUrlFromChrome } from "./utils/getTabUrlFromChrome";

export default async function () {
  const url = await getTabUrlFromChrome();
  if (!url.startsWith('https://shopline.atlassian.net/browse/')) {
    return showToast({
      style: Toast.Style.Failure,
      title: "Not a Jira card",
    });
  }

  const cardName = url.split('/').pop();

  await Clipboard.copy(`[${cardName}](${url})`);
  await showHUD("Copied Card to clipboard");
}