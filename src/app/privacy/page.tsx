'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <span className="mr-2">←</span>
        {language === 'ja' ? 'トップに戻る' : 'Back to Home'}
      </Link>

      {language === 'ja' ? (
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>
          
          <p className="text-gray-600 mb-6">最終更新日: 2025年7月1日</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. はじめに</h2>
            <p>
              ひとりあそび研究所（以下「当団体」）が運営する「マイ・トーキョー・ジェム」（以下「本サービス」）は、
              利用者のプライバシーを尊重し、個人情報の保護に努めています。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. 収集する情報</h2>
            <p>現在、本サービスでは以下の情報を収集しています：</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Cookie（セッション管理のため）</li>
              <li>アクセスログ（サービス改善のため）</li>
            </ul>
            <p className="mt-2">
              ※現時点では、一般利用者の個人情報（氏名、メールアドレス等）は収集していません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. 情報の利用目的</h2>
            <p>収集した情報は以下の目的で利用します：</p>
            <ul className="list-disc pl-6 mt-2">
              <li>サービスの提供・維持・改善</li>
              <li>利用状況の分析</li>
              <li>技術的な問題の解決</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Cookieについて</h2>
            <p>
              本サービスでは、より良いサービス提供のためにCookieを使用しています。
              ブラウザの設定によりCookieを無効にすることも可能ですが、
              一部の機能が利用できなくなる場合があります。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. 第三者への提供</h2>
            <p>
              当団体は、法令に基づく場合を除き、利用者の同意なく第三者に情報を提供することはありません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. お問い合わせ</h2>
            <p>
              本プライバシーポリシーに関するお問い合わせは、以下までご連絡ください：
            </p>
            <p className="mt-2">
              ひとりあそび研究所
            </p>
          </section>
        </div>
      ) : (
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <p className="text-gray-600 mb-6">Last updated: July 1, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Solo Play Research Institute operates MyTokyoGem service. 
              We respect your privacy and are committed to protecting your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p>We currently collect the following information:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Cookies (for session management)</li>
              <li>Access logs (for service improvement)</li>
            </ul>
            <p className="mt-2">
              Note: We do not currently collect personal information (name, email, etc.) from general users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Use of Information</h2>
            <p>We use collected information for:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Providing, maintaining, and improving our service</li>
              <li>Analyzing usage patterns</li>
              <li>Resolving technical issues</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Cookies</h2>
            <p>
              We use cookies to provide better service. You can disable cookies in your browser settings,
              but some features may not work properly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Disclosure</h2>
            <p>
              We do not provide information to third parties without user consent,
              except as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
            <p>
              For questions about this Privacy Policy, please contact:
            </p>
            <p className="mt-2">
              Solo Play Research Institute
            </p>
          </section>
        </div>
      )}
    </div>
  );
}