import { Settings } from '../../types/settings';
import { saveSettings } from '../../storage/settings';

interface UsePlatformToggleParams {
  settings: Settings;
  onSettingsChange: () => void;
}

export function usePlatformToggle({ settings, onSettingsChange }: UsePlatformToggleParams) {
  const handleToggle = async (key: string, checked: boolean) => {
    const newSettings: Settings = {
      ...settings,
      platforms: {
        ...settings.platforms,
        [key]: checked,
      },
    };
    await saveSettings(newSettings);
    onSettingsChange();
  };

  return { handleToggle };
}

