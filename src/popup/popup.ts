import { getSettings, saveSettings } from '../storage/settings';
import { Settings } from '../types/settings';
import { t } from '../i18n';
import './popup.css';

const PLATFORM_NAME_KEYS: Record<string, string> = {
  youtube: 'platformYoutube',
  tiktok: 'platformTiktok',
  vk: 'platformVk',
  instagram: 'platformInstagram',
};

const PLATFORM_ICONS: Record<string, string> = {
  youtube: 'popup/icons/youtube.svg',
  tiktok: 'popup/icons/tiktok.svg',
  vk: 'popup/icons/vk.svg',
  instagram: 'popup/icons/instagram.svg',
};

async function getBlockedCount(): Promise<number> {
  const result = await chrome.storage.local.get(['blockedCount']);
  return result.blockedCount ?? 0;
}

function formatBlockedCount(count: number): string {
  if (count === 1) {
    return `1 ${t('popupTime')}`;
  }
  return `${count} ${t('popupTimes')}`;
}

function createToggleSwitch(
  checked: boolean,
  onChange: (checked: boolean) => void
): HTMLDivElement {
  const toggle = document.createElement('div');
  toggle.className = `toggle-switch ${checked ? 'active' : ''}`;
  
  toggle.addEventListener('click', () => {
    const newState = !toggle.classList.contains('active');
    toggle.classList.toggle('active', newState);
    onChange(newState);
  });
  
  return toggle;
}

async function renderPopup(): Promise<void> {
  const settings = await getSettings();
  const blockedCount = await getBlockedCount();

  const blockedCountEl = document.getElementById('blockedCount');
  if (blockedCountEl) {
    blockedCountEl.textContent = formatBlockedCount(blockedCount);
  }

  const platformsList = document.getElementById('platformsList');
  if (platformsList) {
    platformsList.innerHTML = '';
    
    const platforms = [
      { key: 'youtube', nameKey: PLATFORM_NAME_KEYS.youtube, icon: PLATFORM_ICONS.youtube },
      { key: 'tiktok', nameKey: PLATFORM_NAME_KEYS.tiktok, icon: PLATFORM_ICONS.tiktok },
      { key: 'vk', nameKey: PLATFORM_NAME_KEYS.vk, icon: PLATFORM_ICONS.vk },
      { key: 'instagram', nameKey: PLATFORM_NAME_KEYS.instagram, icon: PLATFORM_ICONS.instagram },
    ];

    platforms.forEach(({ key, nameKey, icon }) => {
      const enabled = settings.platforms[key as keyof typeof settings.platforms];
      const name = t(nameKey);
      
      const item = document.createElement('div');
      item.className = 'platform-item';
      
      const content = document.createElement('div');
      content.className = 'platform-content';
      
      const iconEl = document.createElement('img');
      iconEl.className = 'platform-icon';
      iconEl.src = icon;
      iconEl.alt = name;
      iconEl.width = 24;
      iconEl.height = 24;
      
      const nameEl = document.createElement('span');
      nameEl.className = 'platform-name';
      nameEl.textContent = name;
      
      content.appendChild(iconEl);
      content.appendChild(nameEl);
      
      const toggle = createToggleSwitch(
        enabled && settings.enabled,
        async (checked) => {
          const newSettings: Settings = {
            ...settings,
            platforms: {
              ...settings.platforms,
              [key]: checked,
            },
          };
          await saveSettings(newSettings);
          renderPopup();
        }
      );
      
      if (!settings.enabled) {
        toggle.classList.add('disabled');
      }
      
      item.appendChild(content);
      item.appendChild(toggle);
      platformsList.appendChild(item);
    });
  }
}

function initI18n(): void {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      element.textContent = t(key);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initI18n();
  renderPopup();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedCount) {
    const blockedCountEl = document.getElementById('blockedCount');
    if (blockedCountEl) {
      blockedCountEl.textContent = formatBlockedCount(changes.blockedCount.newValue ?? 0);
    }
  }
});
