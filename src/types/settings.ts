export interface PlatformSettings {
  youtube: boolean;
  tiktok: boolean;
  vk: boolean;
  instagram: boolean;
}

export interface Settings {
  enabled: boolean;
  platforms: PlatformSettings;
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  platforms: {
    youtube: true,
    tiktok: true,
    vk: true,
    instagram: true,
  },
};

