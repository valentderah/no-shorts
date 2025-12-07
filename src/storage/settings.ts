import { Settings, PlatformSettings, DEFAULT_SETTINGS } from '../types/settings';

export async function getSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['settings'], (result: { settings?: Settings }) => {
      if (result.settings) {
        resolve(result.settings as Settings);
      } else {
        resolve(DEFAULT_SETTINGS);
      }
    });
  });
}

export async function saveSettings(settings: Settings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ settings }, () => {
      resolve();
    });
  });
}

export async function isPlatformEnabled(platform: keyof PlatformSettings): Promise<boolean> {
  const settings = await getSettings();
  return settings.enabled && settings.platforms[platform];
}

export function onSettingsChanged(callback: (settings: Settings) => void): void {
  chrome.storage.onChanged.addListener((changes: { [key: string]: { oldValue?: any; newValue?: any } }, areaName: string) => {
    if (areaName === 'sync' && changes.settings) {
      callback(changes.settings.newValue as Settings);
    }
  });
}

