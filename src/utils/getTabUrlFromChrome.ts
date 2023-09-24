import { runAppleScript } from 'run-applescript';

export async function getTabUrlFromChrome(): Promise<string> {
  return runAppleScript(`
    set _url to ""
    tell application "Google Chrome"
      set _url to get URL of active tab of first window
    end tell
    return _url
  `);
}

export async function getTextFromActiveTab(jsCode: string): Promise<string> {
  return runAppleScript(`
    set _text to ""
    tell application "Google Chrome" to tell active tab of first window
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
