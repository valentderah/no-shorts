import { Selectors, observeAndClean } from './dom-cleaner';
import { isPlatformEnabled } from '../../storage/settings';
import { createPageGuard, PageGuardOptions } from './page-guard';

export interface ContentInitOptions extends PageGuardOptions {
  selectors: Selectors;
  customCleanup?: () => void;
}

export async function initContentScript(options: ContentInitOptions): Promise<void> {
  const { platform, pathnamePatterns, selectors, customCleanup } = options;
  const enabled = await isPlatformEnabled(platform);

  if (!enabled) {
    return;
  }

  const guard = createPageGuard({ platform, pathnamePatterns });
  guard.checkAndBlock();

  if (document.readyState === 'complete') {
    return;
  }

  guard.setupHistoryInterception();

  const startCleaning = () => {
    guard.checkAndBlock();
    
    if (customCleanup) {
      customCleanup();
    }
    
    if (document.body) {
      observeAndClean(selectors);
    } else {
      const observer = new MutationObserver((mutations, obs) => {
        if (document.body) {
          obs.disconnect();
          guard.checkAndBlock();
          if (customCleanup) {
            customCleanup();
          }
          observeAndClean(selectors);
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

