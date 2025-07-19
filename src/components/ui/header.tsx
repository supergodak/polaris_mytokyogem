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
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/mytokyogem_logo.png"
              alt="MyTokyoGem Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              href="/favorites" 
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
            >
              <span className="text-red-600">❤️</span>
              <span className="text-sm font-medium text-gray-700">
                {language === 'ja' ? '気になる' : 'Favorites'}
                {favoriteCount > 0 && (
                  <span className="ml-1 text-red-600">({favoriteCount})</span>
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