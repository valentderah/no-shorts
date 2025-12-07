import { Selectors } from './shared/dom-cleaner';
import { initContentScript } from './shared/content-init';

const INSTAGRAM_SELECTORS: Selectors = {
  navigation: [
    'a[href*="/reels"]',
    'svg[aria-label*="Reels"]',
    'a[aria-label*="Reels"]',
    '[aria-label*="Reels"]',
  ],
  feed: [
    'article[role="presentation"]:has(a[href*="/reels/"])',
    'article:has(a[href*="/reels/"])',
    'div[role="main"] article:has(a[href*="/reels/"])',
  ],
};

initContentScript({
  platform: 'instagram',
  pathnamePatterns: ['/reels'],
  selectors: INSTAGRAM_SELECTORS,
});

