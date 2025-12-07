export function t(key: string): string {
  try {
    return chrome.i18n.getMessage(key) || key;
  } catch (e) {
    console.warn(`Translation key not found: ${key}`, e);
    return key;
  }
}

export function initI18n(): void {
}

export function getLocale(): string {
  try {
    return chrome.i18n.getUILanguage() || 'en';
  } catch (e) {
    return 'en';
  }
}

export function setLocale(_locale: string): void {
}
