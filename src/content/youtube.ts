import { blockPage, shouldBlockPage } from './shared/page-blocker';
import { observeAndClean, Selectors, hideElementsByText } from './shared/dom-cleaner';
import { isPlatformEnabled } from '../storage/settings';

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
    'ytd-item-section-renderer:has(ytd-reel-shelf-renderer)',
    'ytd-rich-section-renderer:has(ytd-reel-shelf-renderer)',
    'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])',
    'ytd-rich-item-renderer:has(ytm-shorts-lockup-view-model)',
  ],
};

function checkAndBlock(): void {
  const url = window.location.href;
  const pathname = window.location.pathname;
  
  if (shouldBlockPage(url, 'youtube') || pathname === '/shorts' || pathname.startsWith('/shorts/')) {
    blockPage();
    return;
  }
}

async function init(): Promise<void> {
  const enabled = await isPlatformEnabled('youtube');

  if (!enabled) {
    return;
  }

  checkAndBlock();
  
  if (document.readyState === 'complete') {
    return;
  }

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    setTimeout(checkAndBlock, 0);
  };

  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    setTimeout(checkAndBlock, 0);
  };

  window.addEventListener('popstate', () => {
    setTimeout(checkAndBlock, 0);
  });

  const startCleaning = () => {
    checkAndBlock();
    
    if (document.body) {
      const guideEntries = document.querySelectorAll('ytd-guide-entry-renderer');
      guideEntries.forEach((entry) => {
        const titleElement = entry.querySelector('yt-formatted-string.title');
        if (titleElement && titleElement.textContent?.trim() === 'Shorts') {
          (entry as HTMLElement).style.display = 'none';
        }
      });
      
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
      
      observeAndClean(YOUTUBE_SELECTORS);
    } else {
      const observer = new MutationObserver((mutations, obs) => {
        if (document.body) {
          obs.disconnect();
          checkAndBlock();
          
          const guideEntries = document.querySelectorAll('ytd-guide-entry-renderer');
          guideEntries.forEach((entry) => {
            const titleElement = entry.querySelector('yt-formatted-string.title');
            if (titleElement && titleElement.textContent?.trim() === 'Shorts') {
              (entry as HTMLElement).style.display = 'none';
            }
          });
          
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
          
          observeAndClean(YOUTUBE_SELECTORS);
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

