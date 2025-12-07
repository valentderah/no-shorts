import { hideElements, Selectors } from '../shared/dom-cleaner';
import { initContentScript } from '../shared/content-init';

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

function cleanup(): void {
  hideElements(YOUTUBE_SELECTORS.navigation);
  
  const pathname = window.location.pathname;
  const isYouPage = pathname === '/feed/you';
  
  if (isYouPage) {
    const feedSelectorsWithoutCards = YOUTUBE_SELECTORS.feed.filter(
      selector => !selector.includes('ytd-rich-item-renderer')
    );
    hideElements(feedSelectorsWithoutCards);
  } else {
    hideElements(YOUTUBE_SELECTORS.feed);
  }

  const guideEntries = document.querySelectorAll('ytd-guide-entry-renderer');
  guideEntries.forEach((entry) => {
    const titleElement = entry.querySelector('yt-formatted-string.title');
    if (titleElement?.textContent?.trim() === 'Shorts') {
      (entry as HTMLElement).style.display = 'none';
    }
  });

  const isWatchPage = pathname.startsWith('/watch');
  if (isWatchPage) {
    return;
  }

  const richShelves = document.querySelectorAll('ytd-rich-shelf-renderer');
  richShelves.forEach((shelf) => {
    if (shelf.hasAttribute('is-shorts')) {
      (shelf as HTMLElement).style.display = 'none';
      return;
    }
    const titleElement = shelf.querySelector('span#title');
    if (titleElement?.textContent?.trim() === 'Shorts') {
      (shelf as HTMLElement).style.display = 'none';
    }
  });

  const videoRenderers = document.querySelectorAll('ytd-video-renderer');
  videoRenderers.forEach((renderer) => {
    if (renderer.querySelector('a[href*="/shorts"]')) {
      (renderer as HTMLElement).style.display = 'none';
    }
  });
}

initContentScript({
  platform: 'youtube',
  pathnamePatterns: ['/shorts'],
  cleanup,
});

