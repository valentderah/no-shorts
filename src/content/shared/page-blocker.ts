import { t } from '../../i18n';

export function blockPage(): void {
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }
        .blocker-container {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          max-width: 500px;
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

export function shouldBlockPage(url: string, platform: 'youtube' | 'tiktok' | 'vk' | 'instagram'): boolean {
  const patterns: Record<string, RegExp> = {
    youtube: /^https?:\/\/[^/]+\.youtube\.com\/shorts(\/|$)/,
    tiktok: /^https?:\/\/[^/]+\.tiktok\.com\//,
    vk: /^https?:\/\/vk\.com\/clips(\/|$)/,
    instagram: /^https?:\/\/[^/]+\.instagram\.com\/reels(\/|$)/,
  };

  return patterns[platform]?.test(url) ?? false;
}

