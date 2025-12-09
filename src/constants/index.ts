export const TELEGRAM_LINK = 'https://t.me/valentderah';

export const PLATFORM_NAME_KEYS: Record<string, string> = {
  youtube: 'platformYoutube',
  tiktok: 'platformTiktok',
  vk: 'platformVk',
  instagram: 'platformInstagram',
};

export const PLATFORM_ICONS: Record<string, string> = {
  youtube: 'popup/icons/youtube.svg',
  tiktok: 'popup/icons/tiktok.svg',
  vk: 'popup/icons/vk.svg',
  instagram: 'popup/icons/instagram.svg',
};

export const PLATFORMS = [
  { key: 'youtube', nameKey: PLATFORM_NAME_KEYS.youtube, icon: PLATFORM_ICONS.youtube },
  { key: 'tiktok', nameKey: PLATFORM_NAME_KEYS.tiktok, icon: PLATFORM_ICONS.tiktok },
  { key: 'vk', nameKey: PLATFORM_NAME_KEYS.vk, icon: PLATFORM_ICONS.vk },
  { key: 'instagram', nameKey: PLATFORM_NAME_KEYS.instagram, icon: PLATFORM_ICONS.instagram },
] as const;

