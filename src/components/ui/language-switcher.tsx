'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGES, Language } from '@/lib/i18n';
import { trackLanguageChange } from '@/lib/analytics';

const FLAG_EMOJIS = {
  ja: '🇯🇵',
  en: '🇺🇸'
} as const;

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    trackLanguageChange(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1 text-sm rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span className="text-lg">{FLAG_EMOJIS[language]}</span>
        <svg 
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[80px]">
          {Object.entries(LANGUAGES).map(([lang, label]) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang as Language)}
              className={`w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                language === lang ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span className="text-base">{FLAG_EMOJIS[lang as keyof typeof FLAG_EMOJIS]}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}