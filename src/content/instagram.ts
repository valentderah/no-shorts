import { blockPage, shouldBlockPage } from './shared/page-blocker';
import { observeAndClean, Selectors } from './shared/dom-cleaner';
import { isPlatformEnabled } from '../storage/settings';

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

function checkAndBlock(): void {
  const url = window.location.href;
  const pathname = window.location.pathname;
  
  if (shouldBlockPage(url, 'instagram') || pathname === '/reels' || pathname.startsWith('/reels/')) {
    blockPage();
    return;
  }
}

async function init(): Promise<void> {
  const enabled = await isPlatformEnabled('instagram');

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
      observeAndClean(INSTAGRAM_SELECTORS);
    } else {
      const observer = new MutationObserver((mutations, obs) => {
        if (document.body) {
          obs.disconnect();
          observeAndClean(INSTAGRAM_SELECTORS);
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

