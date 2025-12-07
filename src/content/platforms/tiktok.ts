import { initContentScript } from '../shared/content-init';

function cleanup(): void {}

initContentScript({
  platform: 'tiktok',
  pathnamePatterns: [],
  cleanup,
});

