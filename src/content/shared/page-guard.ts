import { t } from '../../i18n';
import { Platform } from '../../types/settings';

export interface PageGuardOptions {
  platform: Platform;
  pathnamePatterns: string[];
}

const BLOCK_PATTERNS: Record<Platform, RegExp[]> = {
  youtube: [/^https?:\/\/[^/]+\.youtube\.com\/shorts(\/|$)/],
  tiktok: [/^https?:\/\/[^/]+\.tiktok\.com\//],
  vk: [
    /^https?:\/\/vk\.com\/clips(\/|$)/,
    /^https?:\/\/vk\.ru\/clips(\/|$)/,
    /^https?:\/\/vkvideo\.ru\/clip-/,
  ],
  instagram: [/^https?:\/\/[^/]+\.instagram\.com\/reels(\/|$)/],
};

async function incrementBlockedCount(): Promise<void> {
  const result = await chrome.storage.local.get(['blockedCount']);
  const currentCount = result.blockedCount ?? 0;
  await chrome.storage.local.set({ blockedCount: currentCount + 1 });
}

function blockPage(): void {
  incrementBlockedCount();

  const blockerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${t('blockerTitle')}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #000;
          color: #fff;
        }
        .blocker-container {
          text-align: center;
          padding: 2rem;
          background: #2a2a2a;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          max-width: 500px;
        }
        .blocker-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          display: block;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        p {
          font-size: 1.1rem;
          opacity: 0.9;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="blocker-container">
        <span class="blocker-icon">🚫</span>
        <h1>${t('blockerTitle')}</h1>
        <p>${t('blockerMessage')}</p>
      </div>
    </body>
    </html>
  `;

  document.open();
  document.write(blockerHTML);
  document.close();
}

function shouldBlockPage(url: string, platform: Platform): boolean {
  const patterns = BLOCK_PATTERNS[platform];
  return patterns?.some(pattern => pattern.test(url)) ?? false;
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