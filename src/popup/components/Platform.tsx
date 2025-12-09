import React from 'react';
import { t } from '../../i18n';
import { ToggleSwitch } from './ToggleSwitch';

interface PlatformProps {
  nameKey: string;
  icon: string;
  enabled: boolean;
  disabled: boolean;
  onToggle: (checked: boolean) => void;
}

export const Platform: React.FC<PlatformProps> = ({
  nameKey,
  icon,
  enabled,
  disabled,
  onToggle,
}) => {
  const name = t(nameKey);

  return (
    <div className="platform-item">
      <div className="platform-content">
        <img
          className="platform-icon"
          src={icon}
          alt={name}
          width={24}
          height={24}
        />
        <span className="platform-name">{name}</span>
      </div>
      <ToggleSwitch checked={enabled} disabled={disabled} onChange={onToggle} />
    </div>
  );
};

