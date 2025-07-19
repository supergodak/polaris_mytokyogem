export type Language = 'en' | 'ja';

export const DEFAULT_LANGUAGE: Language = 'en';

export const LANGUAGES = {
  en: 'English',
  ja: '日本語'
} as const;

export interface LocalizedContent {
  ja: string;
  en: string;
}

export function getLocalizedContent(content: LocalizedContent, language: Language): string {
  return content[language] || content[DEFAULT_LANGUAGE];
}