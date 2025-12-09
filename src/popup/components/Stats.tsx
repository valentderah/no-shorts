import React from 'react';
import { t } from '../../i18n';
import { Logo } from './Logo';
import { Subtitle } from './Subtitle';

interface StatsProps {
  count: number;
}

export const Stats: React.FC<StatsProps> = ({ count }) => {
  return (
    <div className="stats-block">
      <Logo />
      <Subtitle text={t('popupBlocked')} />
      <div className="stats-count">{count}</div>
    </div>
  );
};

