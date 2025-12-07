import { Settings, PlatformSettings, DEFAULT_SETTINGS } from '../types/settings';

export async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.sync.get(['settings']);
  return (result.settings as Settings) ?? DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Settings): Promise<void> {
  await chrome.storage.sync.set({ settings });
}

export async function isPlatformEnabled(platform: keyof PlatformSettings): Promise<boolean> {
  const settings = await getSettings();
  return settings.enabled && settings.platforms[platform];
}
