import { blockPage, shouldBlockPage } from './shared/page-blocker';
import { isPlatformEnabled } from '../storage/settings';

async function init(): Promise<void> {
  const url = window.location.href;
  const enabled = await isPlatformEnabled('tiktok');

  if (!enabled) {
    return;
  }

  if (shouldBlockPage(url, 'tiktok')) {
    blockPage();
  }
}

init();

