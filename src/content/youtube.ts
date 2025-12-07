import { Selectors } from './shared/dom-cleaner';
import { initContentScript } from './shared/content-init';

const YOUTUBE_SELECTORS: Selectors = {
  navigation: [
    'a[href*="/shorts"]',
    'ytd-mini-guide-entry-renderer[aria-label*="Shorts"]',
    'ytd-guide-entry-renderer[aria-label*="Shorts"]',
    'ytd-mobile-guide-entry-renderer[aria-label*="Shorts"]',
    '#guide-item[aria-label*="Shorts"]',
    'a.yt-simple-endpoint[title="Shorts"]',
    'ytd-guide-entry-renderer a[title="Shorts"]',
  ],
  feed: [
    'ytd-reel-shelf-renderer',
    'ytd-shorts[class*="shorts"]',
    'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-rich-item-renderer:has(ytm-shorts-lockup-view-model)',
  ],
};

function customCleanup(): void {
  const guideEntries = document.querySelectorAll('ytd-guide-entry-renderer');
  guideEntries.forEach((entry) => {
    const titleElement = entry.querySelector('yt-formatted-string.title');
    if (titleElement && titleElement.textContent?.trim() === 'Shorts') {
      (entry as HTMLElement).style.display = 'none';
    }
  });
  
  const isWatchPage = window.location.pathname.startsWith('/watch');
  if (!isWatchPage) {
    const richShelves = document.querySelectorAll('ytd-rich-shelf-renderer');
    richShelves.forEach((shelf) => {
      const titleElement = shelf.querySelector('span#title');
      if (titleElement && titleElement.textContent?.trim() === 'Shorts') {
        (shelf as HTMLElement).style.display = 'none';
      }
      if (shelf.hasAttribute('is-shorts')) {
        (shelf as HTMLElement).style.display = 'none';
      }
    });
  }
}

initContentScript({
  platform: 'youtube',
  pathnamePatterns: ['/shorts'],
  selectors: YOUTUBE_SELECTORS,
  customCleanup,
});

