import React from 'react';
import { t } from '../../i18n';
import { Title } from './Title';
import { Social } from './Social';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <Title text={t('appName')} />
      <Social />
    </header>
  );
};

