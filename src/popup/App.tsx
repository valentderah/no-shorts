import React from 'react';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { PlatformList } from './components/PlatformList';
import { usePopupData } from './hooks/usePopupData';
import './popup.scss';

export const App: React.FC = () => {
  const { settings, blockedCount, reloadData } = usePopupData();

  if (!settings) {
    return null;
  }

  return (
    <>
      <Header />
      <Stats count={blockedCount} />
      <PlatformList settings={settings} onSettingsChange={reloadData} />
    </>
  );
};

