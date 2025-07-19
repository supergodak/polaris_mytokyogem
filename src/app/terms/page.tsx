'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <span className="mr-2">←</span>
        {language === 'ja' ? 'トップに戻る' : 'Back to Home'}
      </Link>

      {language === 'ja' ? (
        <div className="prose max-w-none">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/mytokyogem_logo.png"
                alt="MyTokyoGem Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <h1 className="text-3xl font-bold mb-4">利用規約</h1>
            <p className="text-gray-600">最終更新日: 2025年1月19日</p>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">第1条（本規約の適用）</h2>
              <p className="text-gray-700 leading-relaxed">
                本利用規約（以下「本規約」）は、ひとりあそび研究所（以下「当団体」）が提供する「マイ・トーキョー・ジェム」（以下「本サービス」）の利用に関する条件を定めるものです。本サービスをご利用になる場合には、本規約にご同意いただいたものとみなします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">第2条（サービスの内容）</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>本サービスは、東京のローカルスポット情報を共有するプラットフォームです。</p>
                <p>現在は実証実験（PoC）フェーズであり、以下の機能を提供しています：</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>スポット情報の閲覧</li>
                  <li>「気になる」スポットの保存機能（ローカルストレージ使用）</li>
                  <li>日英両言語での情報提供</li>
                  <li>お問い合わせ機能</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">第3条（利用者の責任）</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>利用者は、以下の事項について責任を負うものとします：</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>本サービスの利用にあたり、法令および本規約を遵守すること</li>
                  <li>他の利用者や第三者の権利を侵害しないこと</li>
                  <li>虚偽の情報を提供しないこと</li>
                  <li>本サービスの運営を妨げる行為を行わないこと</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">第4条（禁止事項）</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>利用者は、本サービスの利用にあたり、以下の行為を行ってはなりません：</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>法令に違反する行為</li>
                  <li>公序良俗に反する行為</li>
                  <li>他者の著作権、肖像権、プライバシー権その他の権利を侵害する行為</li>
                  <li>誹謗中傷、差別的表現を含む投稿</li>
                  <li>営利目的での利用（当団体が許可した場合を除く）</li>
                  <li>本サービスの技術的制約を回避する行為</li>
                  <li>その他、当団体が不適切と判断する行為</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">第5条（サービスの変更・中断・終了）</h2>
              <p className="text-gray-700 leading-relaxed">
                当団体は、事前の通知なく、本サービスの内容の変更、一時中断、または終了を行うことができるものとします。これらによって利用者に生じた損害について、当団体は一切の責任を負いません。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">第6条（免責事項）</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>当団体は、以下について一切の責任を負いません：</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>本サービスで提供される情報の正確性、完全性、有用性</li>
                  <li>利用者が本サービスを利用して行った行動の結果</li>
                  <li>本サービスの利用によって生じた直接的・間接的損害</li>
                  <li>システムの不具合、データの消失等の技術的問題</li>
                </ul>
                <p className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <strong>重要：</strong> 本サービスは実証実験段階であり、データの消失やサービスの予期しない中断が発生する可能性があります。重要な情報の保存は、別途バックアップを取ることをお勧めします。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">第7条（個人情報の取扱い）</h2>
              <p className="text-gray-700 leading-relaxed">
                当団体は、利用者の個人情報を「プライバシーポリシー」に従って適切に取り扱います。詳細は
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">プライバシーポリシー</Link>
                をご確認ください。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">第8条（規約の変更）</h2>
              <p className="text-gray-700 leading-relaxed">
                当団体は、必要に応じて本規約を変更することができます。重要な変更がある場合は、本サービス上で事前に通知いたします。変更後も本サービスを継続して利用される場合、変更後の規約に同意したものとみなします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">第9条（準拠法・管轄裁判所）</h2>
              <p className="text-gray-700 leading-relaxed">
                本規約は日本法に準拠し、本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">第10条（お問い合わせ）</h2>
              <p className="text-gray-700 leading-relaxed">
                本規約に関するご質問は、
                <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">お問い合わせフォーム</Link>
                よりご連絡ください。
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">運営</p>
              <p className="text-lg font-medium text-gray-800">ひとりあそび研究所</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="prose max-w-none">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/mytokyogem_logo.png"
                alt="MyTokyoGem Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: January 19, 2025</p>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 1 (Application of Terms)</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service ("Terms") set forth the conditions for using "MyTokyoGem" ("Service") provided by Hitoriasobi Lab ("We"). By using this Service, you are deemed to have agreed to these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 2 (Service Content)</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>This Service is a platform for sharing local spot information in Tokyo.</p>
                <p>Currently in proof-of-concept (PoC) phase, providing the following features:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Browsing spot information</li>
                  <li>"Favorite" spot saving function (using local storage)</li>
                  <li>Information in both Japanese and English</li>
                  <li>Contact functionality</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 3 (User Responsibilities)</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>Users are responsible for the following:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Complying with laws and these Terms when using the Service</li>
                  <li>Not infringing on the rights of other users or third parties</li>
                  <li>Not providing false information</li>
                  <li>Not engaging in activities that interfere with Service operation</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 4 (Prohibited Activities)</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>Users must not engage in the following activities when using the Service:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Activities that violate laws</li>
                  <li>Activities contrary to public order and morals</li>
                  <li>Infringement of copyrights, portrait rights, privacy rights, or other rights</li>
                  <li>Posts containing defamation or discriminatory expressions</li>
                  <li>Commercial use (except when permitted by us)</li>
                  <li>Circumventing technical limitations of the Service</li>
                  <li>Other activities deemed inappropriate by us</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 5 (Service Changes, Suspension, Termination)</h2>
              <p className="text-gray-700 leading-relaxed">
                We may change, temporarily suspend, or terminate the Service without prior notice. We assume no responsibility for any damages caused to users by such actions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 6 (Disclaimer)</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>We assume no responsibility for the following:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Accuracy, completeness, or usefulness of information provided through the Service</li>
                  <li>Results of actions taken by users using the Service</li>
                  <li>Direct or indirect damages caused by using the Service</li>
                  <li>Technical issues such as system malfunctions or data loss</li>
                </ul>
                <p className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <strong>Important:</strong> This Service is in experimental phase, and data loss or unexpected service interruptions may occur. We recommend backing up important information separately.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 7 (Personal Information Handling)</h2>
              <p className="text-gray-700 leading-relaxed">
                We handle users' personal information appropriately in accordance with our "Privacy Policy". For details, please refer to our
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline"> Privacy Policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 8 (Terms Modifications)</h2>
              <p className="text-gray-700 leading-relaxed">
                We may modify these Terms as necessary. For significant changes, we will provide advance notice on the Service. Continued use of the Service after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 9 (Governing Law and Jurisdiction)</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by Japanese law, and the Tokyo District Court shall have exclusive jurisdiction for the first instance over disputes related to this Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 10 (Contact)</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions regarding these Terms, please contact us through our
                <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline"> Contact Form</Link>.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Operated by</p>
              <p className="text-lg font-medium text-gray-800">Hitoriasobi Lab</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}