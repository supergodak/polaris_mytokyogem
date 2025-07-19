'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGES, Language } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      {Object.entries(LANGUAGES).map(([lang, label]) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang as Language)}
          className={`px-3 py-1 text-sm rounded ${
            language === lang
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}