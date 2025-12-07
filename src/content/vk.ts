import { Selectors } from './shared/dom-cleaner';
import { initContentScript } from './shared/content-init';

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
    'div[class*="HorizontalScrollBlock__container"][data-block="block"]',
    'div[class*="HorizontalScrollBlock__container"]:has(a[href^="clip-"])',
  ],
};

initContentScript({
  platform: 'vk',
  pathnamePatterns: ['/clips'],
  selectors: VK_SELECTORS,
});

