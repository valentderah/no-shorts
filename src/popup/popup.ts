import { getSettings, saveSettings } from '../storage/settings';
import { Settings } from '../types/settings';
import { t } from '../i18n';
import './popup.css';

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
  
  const titleEl = document.querySelector('.header h1');
  if (titleEl) titleEl.textContent = t('popupTitle');
  
  const subtitleEl = document.querySelector('.header p');
  if (subtitleEl) subtitleEl.textContent = t('popupSubtitle');
  
  const toggleLabel = document.querySelector('.toggle-label');
  if (toggleLabel) toggleLabel.textContent = t('popupMainToggle');
  
  const mainToggle = document.getElementById('mainToggle');
  if (mainToggle) {
    mainToggle.className = `toggle-switch ${settings.enabled ? 'active' : ''}`;
    mainToggle.addEventListener('click', async () => {
      const newSettings: Settings = {
        ...settings,
        enabled: !settings.enabled,
      };
      await saveSettings(newSettings);
      renderPopup();
    });
  }

  const platformsList = document.getElementById('platformsList');
  if (platformsList) {
    platformsList.innerHTML = '';
    
    Object.entries(settings.platforms).forEach(([platform, enabled]) => {
      const item = document.createElement('div');
      item.className = 'platform-item';
      
      const name = document.createElement('span');
      name.className = 'platform-name';
      const platformKey = `platform${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
      name.textContent = t(platformKey);
      
      const toggle = createToggleSwitch(
        enabled && settings.enabled,
        async (checked) => {
          const newSettings: Settings = {
            ...settings,
            platforms: {
              ...settings.platforms,
              [platform]: checked,
            },
          };
          await saveSettings(newSettings);
          renderPopup();
        }
      );
      
      if (!settings.enabled) {
        toggle.classList.add('disabled');
      }
      
      item.appendChild(name);
      item.appendChild(toggle);
      platformsList.appendChild(item);
    });
  }

}

document.addEventListener('DOMContentLoaded', renderPopup);

