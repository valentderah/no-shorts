import { blockPage, shouldBlockPage } from './shared/page-blocker';
import { observeAndClean, Selectors } from './shared/dom-cleaner';
import { isPlatformEnabled } from '../storage/settings';

const VK_SELECTORS: Selectors = {
  navigation: [
    'a[href*="/clips"]',
    '.left_menu_nav_wrap a[href*="clips"]',
    '.side_bar a[href*="clips"]',
    '[data-section="clips"]',
  ],
  feed: [
    '.feed_row[data-section="clips"]',
    '.feed_clips',
    '.feed_row:has(a[href*="/clips/"])',
    '.wall_module:has(.feed_clips)',
    'a.short_video_item',
    'a[href*="/clip-"]',
    '[data-testid="clips-compact-preview"]',
    '.short_video_item',
  ],
};

async function init(): Promise<void> {
  const url = window.location.href;
  const enabled = await isPlatformEnabled('vk');

  if (!enabled) {
    return;
  }

  if (shouldBlockPage(url, 'vk')) {
    blockPage();
    return;
  }

  const startCleaning = () => {
    if (document.body) {
      observeAndClean(VK_SELECTORS);
    } else {
      const observer = new MutationObserver((mutations, obs) => {
        if (document.body) {
          obs.disconnect();
          observeAndClean(VK_SELECTORS);
        }
      });
      observer.observe(document.documentElement, { childList: true });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCleaning);
  } else {
    startCleaning();
  }
}

init();

