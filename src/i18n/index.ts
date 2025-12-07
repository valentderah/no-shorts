export function t(key: string): string {
  try {
    return chrome.i18n.getMessage(key) || key;
  } catch {
    return key;
  }
}
