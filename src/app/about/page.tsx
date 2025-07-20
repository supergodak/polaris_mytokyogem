'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
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
                width={64}
                height={64}
                className="w-16 h-16"
              />
            </div>
            <h1 className="text-3xl font-bold mb-4">マイ・トーキョー・ジェムについて</h1>
            <p className="text-lg text-gray-600">ひっそりリリースのおしらせ</p>
          </div>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              まだまだ人様に見せられる完成度ではないのですが、<br />
              そろそろ誰かに見つけてもらってもいいかな…という気持ちになりまして、<br />
              東京のリアルな「いま」をお届けするプロジェクト、ひっそりと始めます。
            </p>

            <p>
              旅先でよくある「どこ行っても人だらけ問題」。<br />
              ガイドブックを閉じて、もっと静かな場所、<br />
              もっと&ldquo;自分の旅&rdquo;をしたくなること、ありませんか？
            </p>

            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-800">
                <span className="font-semibold text-blue-900">マイ・トーキョー・ジェム</span> は、<br />
                誰かに教えたくなるけど、大声では言いたくないような<br />
                東京の&ldquo;小さな宝石たち&rdquo;をそっと集めていく場所です。
              </p>
            </div>

            <p>
              地元に住むふつうの人たちが、<br />
              &ldquo;自分が好きな場所&rdquo;をこっそり投稿していきます。<br />
              お店や観光地とのしがらみもなく、広告もなし。<br />
              いいと思ったから、ただそれだけで紹介されてます。
            </p>

            <p>
              まだ機能も投稿数もスカスカですが、<br />
              ここからゆっくり、旅人と東京の&ldquo;ちょうどいい関係&rdquo;を育てていけたらと思っています。
            </p>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 text-sm">
                データが消えたり、地図が壊れたり、いろいろあるかもですが、<br />
                ひとつの試みとしてあたたかく見守ってもらえると嬉しいです。
              </p>
            </div>

            <p>
              運営へのひとこと、ひっそりした声援、こんな場所どう？というタレコミも<br />
              すべてありがたく拝見してますので、よろしければお気軽に。<br />
              <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
                （問い合わせフォームはこちら）
              </Link>
            </p>

            <div className="text-center bg-green-50 p-6 rounded-lg">
              <p className="text-green-800 font-medium">
                東京にも、まだ知られてないいい場所、きっとたくさんあります。<br />
                あなただけの&ldquo;My Tokyo Gem&rdquo;を、これから一緒に探していけますように。
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">運営</p>
              <p className="text-lg font-medium text-gray-800">ひとりあそび研究所</p>
              <p className="text-sm text-gray-600 mt-2">
                一人旅の新しい楽しみ方を研究・提案する小さな団体です
              </p>
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
                width={64}
                height={64}
                className="w-16 h-16"
              />
            </div>
            <h1 className="text-3xl font-bold mb-4">About MyTokyoGem</h1>
            <p className="text-lg text-gray-600">A Quiet Launch Announcement</p>
          </div>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              While we&apos;re not quite ready to show this to the world yet,<br />
              we felt it was time to let a few people discover<br />
              this project that brings you the real &ldquo;now&rdquo; of Tokyo.
            </p>

            <p>
              You know that common travel problem: &ldquo;everywhere is packed with people.&rdquo;<br />
              Sometimes you want to close the guidebook and find quieter places,<br />
              more space for &ldquo;your own journey,&rdquo; don&apos;t you?
            </p>

            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-800">
                <span className="font-semibold text-blue-900">MyTokyoGem</span> is a place where we quietly collect<br />
                Tokyo&apos;s &ldquo;little treasures&rdquo; – places you&apos;d want to tell someone about<br />
                but wouldn&apos;t shout from the rooftops.
              </p>
            </div>

            <p>
              Local residents quietly post about<br />
              &ldquo;places they personally love.&rdquo;<br />
              No ties to businesses or tourist spots, no advertisements.<br />
              They&apos;re shared simply because someone thought they were special.
            </p>

            <p>
              The features and posts are still sparse,<br />
              but we hope to slowly nurture the &ldquo;just right relationship&rdquo;<br />
              between travelers and Tokyo from here.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 text-sm">
                Data might disappear, maps might break, various things could happen,<br />
                but we&apos;d be grateful if you could warmly watch over<br />
                this experiment with us.
              </p>
            </div>

            <p>
              We gratefully read all messages to the team,<br />
              quiet encouragement, and tips about &ldquo;how about this place?&rdquo;<br />
              So please feel free to reach out.<br />
              <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
                (Contact form is here)
              </Link>
            </p>

            <div className="text-center bg-green-50 p-6 rounded-lg">
              <p className="text-green-800 font-medium">
                Tokyo surely has many more unknown good places.<br />
                May we explore your own &ldquo;My Tokyo Gem&rdquo; together from now on.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">Operated by</p>
              <p className="text-lg font-medium text-gray-800">Hitoriasobi Lab</p>
              <p className="text-sm text-gray-600 mt-2">
                A small organization researching and proposing new ways to enjoy solo travel
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}