import { showHUD, Clipboard, getPreferenceValues } from "@raycast/api";
import { getTabUrlFromChrome } from "./utils/getTabUrlFromChrome";

export default async function () {
  try {
    const { atlassianDomain } = getPreferenceValues();
    const url = await getTabUrlFromChrome();

    if (!url.startsWith(atlassianDomain)) {
      throw new Error("Not a Jira card");
    }

    const cardName = url.split('/').pop();

    await Clipboard.copy(`[${cardName}](${url})`);
    await showHUD("Copied Card to clipboard");
  } catch (error) {
    if (error instanceof Error) {
      await showHUD(`Error: ${error.message}`);
    }
  }
}