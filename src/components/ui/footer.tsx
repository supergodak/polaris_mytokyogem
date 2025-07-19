'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">
            © 2025 {language === 'ja' ? 'ひとりあそび研究所' : 'Hitoriasobi Lab'}
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              {language === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy'}
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              {language === 'ja' ? '利用規約' : 'Terms of Service'}
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              {language === 'ja' ? 'マイ・トーキョー・ジェムについて' : 'About MyTokyoGem'}
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              {language === 'ja' ? 'お問い合わせ' : 'Contact'}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}