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
- ✅ hideExactLocation機能（隠れ家スポット対応）

### 4. UIコンポーネント
- ✅ Card, Button, Badge コンポーネント
- ✅ Header コンポーネント
- ✅ v0での差し替えを想定したシンプル設計

### 5. フロントエンド機能
- ✅ スポット一覧ページ（カード形式レイアウト）
- ✅ SpotCard コンポーネント
- ✅ スポット詳細ページ（/spots/[id]）
- ✅ 言語切り替え対応
- ✅ Google Maps URLリンク連携（緯度経度パラメータ）
- ✅ 位置情報非表示スポット対応

### 6. プリセットタグシステム
- ✅ 300+タグ定義（基本カテゴリー、ジャンル、旅行スタイル）
- ✅ TagSelectorコンポーネント（サジェスト機能付き）
- ✅ リアルタイム検索・フィルタリング
- ✅ カテゴリー別色分け表示
- ✅ 日英両言語対応

### 7. 管理画面システム
- ✅ NextAuth.js認証システム
- ✅ パスワード認証（admin123）
- ✅ ミドルウェアによる認証保護
- ✅ 管理ダッシュボード
- ✅ スポット一覧管理画面

### 8. スポット登録システム
- ✅ 包括的な登録フォーム（/admin/spots/new）
- ✅ ImageUploadコンポーネント（ドラッグ&ドロップ対応）
- ✅ LocationPickerコンポーネント（プリセット場所選択）
- ✅ タグ選択システム（300+タグから選択）
- ✅ 日英両言語入力対応
- ✅ バリデーション・エラーハンドリング
- ⚠️ **注意**: 現在は入力UIのみ実装、実際の保存機能は未実装

## 現在の動作確認済み項目
- [x] 開発サーバー起動（localhost:3000）
- [x] トップページ表示
- [x] 3つのサンプルスポット表示
- [x] 日英言語切り替え
- [x] スポット詳細ページ遷移
- [x] 画像プレースホルダー表示
- [x] Google Maps URLリンク（地図で見る・経路案内）
- [x] 位置情報非表示スポット（浅草カフェで確認）
- [x] プリセットタグ表示（カテゴリー別色分け）
- [x] 管理画面ログイン（/admin/login）
- [x] 管理ダッシュボード表示
- [x] スポット登録フォーム表示（/admin/spots/new）
- [x] タグ選択機能（サジェスト動作）
- [x] 画像アップロードUI（プレビュー機能）
- [x] 位置情報入力UI（プリセット場所選択）

## 環境変数設定
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
ADMIN_PASSWORD=admin123
```

## 次回実装予定
- [ ] スポット登録フォームの保存機能実装
  - バックエンドAPI作成（/api/spots/create）
  - 画像アップロード処理とURL生成
  - JSONファイルへの新規スポット追加
- [ ] AI翻訳API連携（OpenAI/Claude）
- [ ] 「気になる」「行ってきた」評価システム
- [ ] SNS共有機能
- [ ] サイト説明・法的事項ページ作成
  - About MyTokyoGem（サービス説明）
  - ひとりあそび研究所について
  - 利用規約・プライバシーポリシー
  - Contact / お問い合わせ
- [ ] Netlifyデプロイ設定

## 将来実装予定（フェーズ2以降）
- [ ] ガイドマッチング機能
  - スポットごとに「ガイド希望」「ガイド可能」のマッチング
  - 一人旅の外国人とローカルガイドをつなぐ機能
  - ガイド料金設定・決済機能
  - レビュー・評価システム
  - チャット・連絡機能

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
│   │   ├── login/     # ログインページ
│   │   └── spots/new/ # 新規スポット登録
│   ├── spots/[id]/     # スポット詳細
│   └── api/auth/       # NextAuth API
├── components/         # UIコンポーネント
│   ├── ui/            # 基本UI（v0差し替え対象）
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── header.tsx
│   │   ├── language-switcher.tsx
│   │   ├── tag-selector.tsx
│   │   ├── image-upload.tsx
│   │   └── location-picker.tsx
│   └── features/      # 機能固有コンポーネント
│       └── spot-card.tsx
├── contexts/          # React Context
│   └── LanguageContext.tsx
├── lib/               # ユーティリティ
│   ├── i18n.ts       # 多言語対応
│   ├── data.ts       # データ取得
│   ├── maps.ts       # Google Maps連携
│   └── tags.ts       # タグシステム（300+タグ定義）
├── providers/         # プロバイダー
│   └── session-provider.tsx
└── types/             # 型定義
    └── spot.ts

data/
└── spots.json         # スポットデータ（3つのサンプル）
```

## トラブルシューティング
- **画像が壊れて表示される**: `data/spots.json`のimagesを空配列にすることでプレースホルダー表示
- **認証エラー**: `.env.local`の環境変数設定を確認
- **ビルドエラー**: TypeScript型エラーの可能性、`npm run lint`で確認