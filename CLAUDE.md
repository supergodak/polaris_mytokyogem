# MyTokyoGem 開発記録

## プロジェクト概要
- **サービス名**: MyTokyoGem（マイトーキョージェム）
- **運営**: ひとりあそび研究所
- **目的**: 訪日外国人の一人旅向けに東京のローカルスポットを紹介するWebサービス
- **フェーズ**: PoC（実証実験）

## 技術構成
- **フレームワーク**: Next.js 14 (App Router) + TypeScript
- **スタイリング**: Tailwind CSS
- **認証**: NextAuth.js (credentials provider)
- **デプロイ**: Netlify（予定）
- **データ管理**: JSONファイル + GitHub（PoCフェーズ）

## 実装済み機能

### 1. 基本インフラ
- ✅ Next.jsプロジェクト初期セットアップ
- ✅ TypeScript + Tailwind CSS設定
- ✅ レスポンシブデザイン対応

### 2. 多言語対応システム
- ✅ 日英言語切り替え機能
- ✅ LanguageContext実装
- ✅ LanguageSwitcherコンポーネント

### 3. データ構造
- ✅ Spot型定義（一人旅特化の属性設計）
- ✅ JSONベースのサンプルデータ作成
- ✅ データ取得用のヘルパー関数

### 4. UIコンポーネント
- ✅ Card, Button, Badge コンポーネント
- ✅ Header コンポーネント
- ✅ v0での差し替えを想定したシンプル設計

### 5. フロントエンド機能
- ✅ スポット一覧ページ（カード形式レイアウト）
- ✅ SpotCard コンポーネント
- ✅ スポット詳細ページ（/spots/[id]）
- ✅ 言語切り替え対応

### 6. 管理画面システム
- ✅ NextAuth.js認証システム
- ✅ パスワード認証（admin123）
- ✅ ミドルウェアによる認証保護
- ✅ 管理ダッシュボード
- ✅ スポット一覧管理画面

## 現在の動作確認済み項目
- [x] 開発サーバー起動（localhost:3000）
- [x] トップページ表示
- [x] 3つのサンプルスポット表示
- [x] 日英言語切り替え
- [x] スポット詳細ページ遷移
- [x] 画像プレースホルダー表示
- [x] 管理画面ログイン（/admin/login）
- [x] 管理ダッシュボード表示

## 環境変数設定
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
ADMIN_PASSWORD=admin123
```

## 次回実装予定
- [ ] スポット登録フォーム（画像アップロード、位置情報含む）
- [ ] AI翻訳API連携（OpenAI/Claude）
- [ ] Google Maps連携機能
- [ ] 「気になる」「行ってきた」評価システム
- [ ] SNS共有機能
- [ ] Netlifyデプロイ設定

## 開発コマンド
```bash
npm run dev    # 開発サーバー起動
npm run build  # プロダクションビルド
npm run lint   # ESLint実行
```

## ディレクトリ構造
```
src/
├── app/                 # App Router
│   ├── admin/          # 管理画面
│   ├── spots/[id]/     # スポット詳細
│   └── api/auth/       # NextAuth API
├── components/         # UIコンポーネント
│   ├── ui/            # 基本UI（v0差し替え対象）
│   └── features/      # 機能固有コンポーネント
├── contexts/          # React Context
├── lib/               # ユーティリティ
├── providers/         # プロバイダー
└── types/             # 型定義

data/
└── spots.json         # スポットデータ
```

## トラブルシューティング
- **画像が壊れて表示される**: `data/spots.json`のimagesを空配列にすることでプレースホルダー表示
- **認証エラー**: `.env.local`の環境変数設定を確認
- **ビルドエラー**: TypeScript型エラーの可能性、`npm run lint`で確認