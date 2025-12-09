import { useState, useEffect } from 'react';
import { getSettings } from '../../storage/settings';
import { Settings } from '../../types/settings';

async function getBlockedCount(): Promise<number> {
  const result = await chrome.storage.local.get(['blockedCount']);
  return result.blockedCount ?? 0;
}

export function usePopupData() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [blockedCount, setBlockedCount] = useState<number>(0);

  const loadData = async () => {
    const [loadedSettings, count] = await Promise.all([
      getSettings(),
      getBlockedCount(),
    ]);
    setSettings(loadedSettings);
    setBlockedCount(count);
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === 'local' && changes.blockedCount) {
        setBlockedCount(changes.blockedCount.newValue ?? 0);
      }
      if (areaName === 'sync' && changes.settings) {
        setSettings(changes.settings.newValue as Settings);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
  }, []);

  return { settings, blockedCount, reloadData: loadData };
}

