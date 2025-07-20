# MyTokyoGem 開発記録

## プロジェクト概要
- **サービス名**: マイ・トーキョー・ジェム（MyTokyoGem）
- **運営**: ひとりあそび研究所（Hitoriasobi Lab）
- **目的**: 訪日外国人の一人旅向けに東京のローカルスポットを紹介するWebサービス
- **フェーズ**: PoC（実証実験）

## 技術構成
- **フレームワーク**: Next.js 15 (App Router) + TypeScript
- **スタイリング**: Tailwind CSS
- **認証**: NextAuth.js (credentials provider)
- **デプロイ**: Netlify
- **データベース**: Supabase (PostgreSQL)
- **データ管理**: Supabaseによる一元管理（ローカル・本番共通）
- **お問い合わせ**: Slack Webhook連携

## 実装済み機能

### 1. 基本インフラ
- ✅ Next.js 15プロジェクト初期セットアップ
- ✅ TypeScript + Tailwind CSS設定
- ✅ レスポンシブデザイン対応
- ✅ 開発用デバッガー表示設定

### 2. 多言語対応システム
- ✅ 日英言語切り替え機能
- ✅ LanguageContext実装
- ✅ LanguageSwitcherコンポーネント
- ✅ 統一表記：マイ・トーキョー・ジェム / MyTokyoGem

### 3. データ構造・データベース
- ✅ Spot型定義（一人旅特化の属性設計）
- ✅ Supabase PostgreSQLデータベース設計
- ✅ 既存JSONデータの完全移行（5スポット）
- ✅ データ取得用のヘルパー関数（Supabase対応）
- ✅ hideExactLocation機能（隠れ家スポット対応）
- ✅ createdAt自動記録（作成日時）
- ✅ isHidden機能（下書き保存・非表示設定）
- ✅ JSONファイル（フォールバック用として保持）

### 4. UIコンポーネント
- ✅ Card, Button, Badge コンポーネント
- ✅ Header コンポーネント（統一表記対応）
- ✅ Footer コンポーネント（法的リンク・お問い合わせ）
- ✅ v0での差し替えを想定したシンプル設計

### 5. フロントエンド機能
- ✅ スポット一覧ページ（カード形式レイアウト）
- ✅ SpotCard コンポーネント
- ✅ スポット詳細ページ（/spots/[id]）
- ✅ 言語切り替え対応
- ✅ Google Maps URLリンク連携（緯度経度パラメータ）
- ✅ 位置情報非表示スポット対応
- ✅ モバイル対応画像ギャラリー（スワイプ対応）

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
- ✅ 管理ダッシュボード（非表示スポット含む表示）
- ✅ スポット一覧管理画面（作成日表示・状態ラベル）

### 8. スポット登録・編集システム
- ✅ 包括的な登録フォーム（/admin/spots/new）
- ✅ スポット編集機能（/admin/spots/[id]/edit）
- ✅ ImageUploadコンポーネント（ドラッグ&ドロップ対応）
- ✅ LocationPickerコンポーネント（プリセット場所選択）
- ✅ タグ選択システム（300+タグから選択）
- ✅ 日英両言語入力対応
- ✅ リアルタイム翻訳機能（OpenAI API連携）
- ✅ バリデーション・エラーハンドリング
- ✅ 保存機能実装（API連携完了）
- ✅ 非表示設定（下書き保存機能）

### 9. 「気になる」機能
- ✅ ローカルストレージベースのお気に入り管理
- ✅ ログイン不要でスポット保存
- ✅ ハートボタンUI（🤍→❤️）
- ✅ リアクション数のAPI管理
- ✅ 気になるスポット一覧ページ（/favorites）
- ✅ ヘッダーに気になる数表示
- ✅ 「行ってきた」機能は一時非表示

### 10. 法的ページ・サイト情報
- ✅ プライバシーポリシー（/privacy）
- ✅ Aboutページ（/about）- ひっそりリリース告知
- ✅ お問い合わせフォーム（/contact）
- ✅ Slack Webhook連携
- ✅ 日英両言語対応
- ✅ フッターナビゲーション統合

## 現在の動作確認済み項目
- [x] 開発サーバー起動（localhost:3001）
- [x] サイト名統一表記確認
- [x] トップページ表示（5つのサンプルスポット）
- [x] 日英言語切り替え
- [x] スポット詳細ページ遷移
- [x] 画像ギャラリー（スワイプ・タッチ対応）
- [x] Google Maps URLリンク（地図で見る・経路案内）
- [x] 位置情報非表示スポット対応
- [x] プリセットタグ表示（カテゴリー別色分け）
- [x] 管理画面ログイン（/admin/login）
- [x] 管理ダッシュボード表示（非表示ラベル・作成日表示）
- [x] スポット登録フォーム（翻訳機能付き）
- [x] スポット編集機能
- [x] 気になる機能（ハート・カウント・一覧）
- [x] Aboutページ表示
- [x] お問い合わせフォーム送信
- [x] Slack通知受信

## 環境変数設定
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
ADMIN_PASSWORD=admin123

# OpenAI API設定
OPENAI_API_KEY=sk-proj-***
OPENAI_MODEL=gpt-4.1-nano

# Slack Webhook設定
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/***

# Supabase設定（ローカル・本番共通）
NEXT_PUBLIC_SUPABASE_URL=https://atmzwpnfegalqdtqfwpo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Supabase構成

### データベース設計
- **プロジェクトURL**: https://atmzwpnfegalqdtqfwpo.supabase.co
- **テーブル**: `spots` (PostgreSQL)
- **スキーマ**: 既存Spot型と完全互換性
- **ID形式**: TEXT型（既存IDとの互換性を保持）

### データ統合アーキテクチャ
```
ローカル開発環境 ──┐
                  ├──→ Supabase PostgreSQL
本番環境 ─────────┘    (同一データベース)

フォールバック: data/spots.json
```

### 環境構成の特徴
- **一元管理**: ローカル・本番で同じデータベースを共有
- **リアルタイム同期**: ローカルでの変更が即座に本番に反映
- **シンプルな運用**: 環境別設定が不要
- **本番編集対応**: Netlifyの読み取り専用制限を完全解決

### 移行完了事項
- ✅ 5つのスポットをJSONからSupabaseに移行済み
- ✅ 全API（CRUD）のSupabase対応完了
- ✅ 型安全性確保（TypeScript + ESLint）
- ✅ ビルド成功確認
- ✅ フォールバック機能実装済み

## データ構造の変遷
### 削除済みフィールド
- ❌ `publishedAt` / `expiresAt` - 公開日時管理（複雑すぎるため削除）

### 追加済みフィールド
- ✅ `createdAt` - 作成日時の自動記録
- ✅ `isHidden` - 非表示フラグ（下書き保存用）

## 次回実装予定
- [ ] SNS共有機能の実装
- [ ] レスポンシブデザインの細かい調整
- [ ] 利用規約ページ作成
- [ ] Netlifyデプロイ設定とGitHub Actions

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
│   │   └── spots/     # スポット管理（new/[id]/edit）
│   ├── spots/[id]/     # スポット詳細
│   ├── favorites/      # 気になるスポット一覧
│   ├── about/          # Aboutページ
│   ├── contact/        # お問い合わせフォーム
│   ├── privacy/        # プライバシーポリシー
│   └── api/           # API Routes
│       ├── auth/      # NextAuth API
│       ├── spots/     # スポットCRUD
│       ├── upload/    # 画像アップロード
│       ├── translate/ # 翻訳API
│       └── contact/   # お問い合わせAPI
├── components/         # UIコンポーネント
│   ├── ui/            # 基本UI
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── header.tsx（統一表記対応）
│   │   ├── footer.tsx（法的リンク）
│   │   ├── language-switcher.tsx
│   │   ├── tag-selector.tsx
│   │   ├── image-upload.tsx
│   │   ├── image-gallery.tsx（モバイル対応）
│   │   └── location-picker.tsx
│   └── features/      # 機能固有コンポーネント
│       └── spot-card.tsx（気になる機能付き）
├── contexts/          # React Context
│   └── LanguageContext.tsx
├── hooks/             # Custom Hooks
│   └── useFavorites.ts（ローカルストレージ管理）
├── lib/               # ユーティリティ
│   ├── i18n.ts       # 多言語対応
│   ├── data.ts       # データ取得（Supabase + フォールバック）
│   ├── supabase.ts   # Supabaseクライアント設定
│   ├── supabase-data.ts # Supabaseデータアクセス層
│   ├── maps.ts       # Google Maps連携
│   └── tags.ts       # タグシステム（300+タグ定義）
├── providers/         # プロバイダー
│   └── session-provider.tsx
└── types/             # 型定義
    └── spot.ts（createdAt/isHidden追加）

data/
└── spots.json         # フォールバック用データ（元：5つのサンプル）

scripts/
├── migrate-to-supabase.js      # データ移行スクリプト（実行済み）
└── setup-supabase-schema.js    # スキーマ作成スクリプト

ルート/
├── supabase_schema.sql         # 初期スキーマ（UUID版）
└── supabase_schema_v2.sql      # 最終スキーマ（TEXT ID版）
```

## Slack Webhook設定方法
1. [Slack API](https://api.slack.com/apps) で新しいAppを作成
2. 「Incoming Webhooks」を有効化
3. 「Add New Webhook to Workspace」でチャンネル選択
4. 生成されたWebhook URLを `SLACK_WEBHOOK_URL` に設定

## トラブルシューティング
- **画像が壊れて表示される**: `data/spots.json`のimagesを空配列にすることでプレースホルダー表示
- **認証エラー**: `.env.local`の環境変数設定を確認
- **ビルドエラー**: TypeScript型エラーの可能性、`npm run lint`で確認
- **Next.js 15 params エラー**: `use(params)`フックで解決済み
- **Slack通知が届かない**: Webhook URLとチャンネル権限を確認