import { observeAndClean } from './dom-cleaner';
import { isPlatformEnabled } from '../../storage/settings';
import { createPageGuard, PageGuardOptions } from './page-guard';

export interface ContentInitOptions extends PageGuardOptions {
  cleanup: () => void;
}

export async function initContentScript(options: ContentInitOptions): Promise<void> {
  const { platform, pathnamePatterns, cleanup } = options;
  const enabled = await isPlatformEnabled(platform);

  if (!enabled) {
    return;
  }

  const guard = createPageGuard({ platform, pathnamePatterns });
  guard.checkAndBlock();
  guard.setupHistoryInterception();

  const startCleaning = () => {
    guard.checkAndBlock();
    
    if (document.body) {
      observeAndClean(cleanup);
    } else {
      const observer = new MutationObserver((mutations, obs) => {
        if (document.body) {
          obs.disconnect();
          guard.checkAndBlock();
          observeAndClean(cleanup);
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
