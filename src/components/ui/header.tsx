'use client';

import Link from 'next/link';
import { LanguageSwitcher } from './language-switcher';
import { useLanguage } from '@/contexts/LanguageContext';

export function Header() {
  const { language } = useLanguage();
  
  const title = language === 'ja' ? 'マイ東京ジェム' : 'MyTokyoGem';
  const subtitle = language === 'ja' 
    ? 'ひとりあそび研究所' 
    : 'Solo Adventure Lab';

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}