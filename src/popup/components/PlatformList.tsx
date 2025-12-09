import React from 'react';
import { Settings } from '../../types/settings';
import { t } from '../../i18n';
import { PLATFORMS } from '../../constants';
import { Platform } from './Platform';
import { usePlatformToggle } from '../hooks/usePlatformToggle';

interface PlatformListProps {
  settings: Settings;
  onSettingsChange: () => void;
}

export const PlatformList: React.FC<PlatformListProps> = ({ settings, onSettingsChange }) => {
  const { handleToggle } = usePlatformToggle({ settings, onSettingsChange });

  return (
    <div className="platforms-section">
      <div className="platforms-label">{t('popupPlatforms')}</div>
      <div className="platforms-list">
        {PLATFORMS.map(({ key, nameKey, icon }) => (
          <Platform
            key={key}
            nameKey={nameKey}
            icon={icon}
            enabled={settings.platforms[key as keyof typeof settings.platforms] && settings.enabled}
            disabled={!settings.enabled}
            onToggle={(checked) => handleToggle(key, checked)}
          />
        ))}
      </div>
    </div>
  );
};

