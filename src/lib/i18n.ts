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
  const targetContent = content[language];
  const fallbackContent = content[language === 'en' ? 'ja' : 'en'];
  
  // 対象言語のコンテンツが存在し、空でない場合はそれを返す
  if (targetContent && targetContent.trim() !== '') {
    return targetContent;
  }
  
  // フォールバック言語のコンテンツが存在し、空でない場合はそれを返す
  if (fallbackContent && fallbackContent.trim() !== '') {
    return fallbackContent;
  }
  
  // どちらも空の場合は空文字列を返す
  return '';
}