import { showHUD } from '@raycast/api';
import { runAppleScript } from 'run-applescript';
import { getActiveTabUrl } from './utils/getActiveTabUrl';

async function getCurrentActiveApp(): Promise<string> {
  return runAppleScript(`
    set _activeAppName to ""
    tell application "System Events"
      set _activeAppName to name of application processes whose frontmost is true

      if (_activeAppName as string) = "Electron" then
        set _activeAppName to "VSCode"
      end if
    end tell

    return _activeAppName
  `);
}

async function keyStrokeApp(appName: string, keyStroke: string) {
  return runAppleScript(`
    tell application "${appName}" to activate
    tell application "System Events"
      ${keyStroke}
    end tell
  `);
}

export default async function applyCodeStyle() {
  const activeAppName = await getCurrentActiveApp();

  switch (activeAppName) {
    case 'Slack': {
      return keyStrokeApp(
        'Slack',
        'key code 8 using {command down, shift down}' // 'C'
      );
    }
    case 'Arc':
    case 'Google Chrome': {
      const url = await getActiveTabUrl(activeAppName);

      if (!url) {
        return showHUD('Url not found');
      }

      if (url.href.includes('notion')) {
        return keyStrokeApp(
          'Chrome',
          'key code 14 using {command down}' // 'E'
        );
      }

      if ((url.href.match(/atlassian|bitbucket/)?.length ?? 0) > 0) {
        return keyStrokeApp(
          'Chrome',
          'key code 46 using {command down, shift down}' // 'M'
        );
      }
      return showHUD('Invalid command for this website');
    }
    default:
      return showHUD('Invalid command for this application');
  }
}
