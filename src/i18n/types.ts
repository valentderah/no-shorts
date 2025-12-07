import ru from './locales/ru.json';
import en from './locales/en.json';

export type Locale = 'ru' | 'en';

export type TranslationKeys = typeof ru;

export interface I18nConfig {
  locale: Locale;
  translations: TranslationKeys;
}

