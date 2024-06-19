import { showHUD } from '@raycast/api';
import { runAppleScript } from 'run-applescript';

export async function getActiveTabUrl(browser: string) {
  const script =
    browser === 'Safari'
      ? `
    tell application "Safari"
      if it is running then
        get URL of front document
      end if
    end tell
  `
      : `
    tell application "${browser}"
      if it is running then
        get URL of active tab of front window
      end if
    end tell
  `;
  try {
    const url = await runAppleScript(script);

    if (!url) {
      return null;
    }

    return new URL(url);
  } catch (error) {
    showHUD('Get active tab URL failed.');
    return null;
  }
}

export async function getTextFromActiveTab(jsCode: string, browser: string): Promise<string> {
  return runAppleScript(`
    set _text to ""
    tell application "${browser}" to tell active tab of first window
      set _text to execute javascript "${jsCode}"
    end tell
    return _text
  `);
}

export async function runScriptFromActiveTab(script: string): Promise<void> {
  await runAppleScript(`
    tell application "Google Chrome" to tell active tab of first window
      execute javascript "${script}"
    end tell
  `);
}
