'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LanguageSwitcher } from './language-switcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavorites } from '@/hooks/useFavorites';

export function Header() {
  const { language } = useLanguage();
  const { getFavoriteCount } = useFavorites();
  const favoriteCount = getFavoriteCount();
  
  const title = language === 'ja' ? 'マイ・トーキョー・ジェム' : 'MyTokyoGem';
  const subtitle = language === 'ja' 
    ? 'ひとりあそび研究所' 
    : 'Hitoriasobi Lab';

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <Image
              src="/mytokyogem_logo.png"
              alt="MyTokyoGem Logo"
              width={32}
              height={32}
              className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{title}</h1>
              <p className="text-xs text-gray-500 hidden sm:block truncate">{subtitle}</p>
            </div>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Link 
              href="/favorites" 
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
            >
              <span className="text-red-600 text-sm sm:text-base">❤️</span>
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                <span className="hidden sm:inline">
                  {language === 'ja' ? '気になる' : 'Favorites'}
                </span>
                {favoriteCount > 0 && (
                  <span className="text-red-600">
                    <span className="sm:ml-1">{favoriteCount}</span>
                  </span>
                )}
              </span>
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}