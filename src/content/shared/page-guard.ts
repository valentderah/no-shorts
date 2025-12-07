import { blockPage, shouldBlockPage } from './page-blocker';

export interface PageGuardOptions {
  platform: 'youtube' | 'tiktok' | 'vk' | 'instagram';
  pathnamePatterns: string[];
}

export function createPageGuard(options: PageGuardOptions) {
  const { platform, pathnamePatterns } = options;

  function checkAndBlock(): void {
    const url = window.location.href;
    const pathname = window.location.pathname;
    
    if (shouldBlockPage(url, platform)) {
      blockPage();
      return;
    }
    
    for (const pattern of pathnamePatterns) {
      if (pathname === pattern || pathname.startsWith(pattern + '/')) {
        blockPage();
        return;
      }
    }
  }

  function setupHistoryInterception(): void {
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
  }

  return {
    checkAndBlock,
    setupHistoryInterception,
  };
}

