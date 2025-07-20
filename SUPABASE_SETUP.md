# Supabase設定ガイド

## 環境変数の設定

`.env.local`ファイルに以下の環境変数を追加してください：

```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## Supabaseプロジェクトの設定

### 1. データベーステーブルの作成

Supabase Dashboard > SQL Editorで以下のSQLを実行してください：

```sql
-- spotsテーブルの作成
CREATE TABLE spots (
  id text PRIMARY KEY,
  title_ja text NOT NULL,
  title_en text,
  short_description_ja text NOT NULL,
  short_description_en text,
  description_ja text NOT NULL,
  description_en text,
  images text[],
  location_lat double precision NOT NULL,
  location_lng double precision NOT NULL,
  location_hide_exact boolean DEFAULT false,
  location_address_ja text NOT NULL,
  location_address_en text,
  primary_category text NOT NULL,
  genre text[],
  travel_style text[],
  solo_friendly boolean DEFAULT false,
  business_hours_ja text,
  business_hours_en text,
  access_ja text,
  access_en text,
  tips_ja text,
  tips_en text,
  is_hidden boolean DEFAULT false,
  reactions_interested integer DEFAULT 0,
  reactions_visited integer DEFAULT 0,
  created_by text,
  created_at text DEFAULT (now()::text)
);

-- Row Level Security (RLS) を無効化（本番環境では適切な設定が必要）
ALTER TABLE spots DISABLE ROW LEVEL SECURITY;

-- 公開読み取り権限を付与
GRANT SELECT ON spots TO anon;
GRANT SELECT ON spots TO authenticated;

-- 管理者用権限（必要に応じて）
GRANT ALL ON spots TO authenticated;
```

### 2. Storageバケットの作成

Supabase Dashboard > Storage > Create Bucketで：

1. バケット名: `spot-images`
2. Public bucket: `true` (チェックを入れる)
3. Create bucket

### 3. Storage権限の設定

Storage > spot-images > Policies > New Policyで：

```sql
-- 画像の公開読み取り権限
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'spot-images');

-- 認証済みユーザーの画像アップロード権限
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'spot-images');
```

## 既存データの移行

既存の`data/spots.json`からSupabaseに移行する場合は、以下のスクリプトを使用できます：

```javascript
// 移行スクリプト例（開発者向け）
// Supabase Dashboard > SQL Editorで実行

-- サンプルデータを挿入（spots.jsonの内容を変換して挿入）
INSERT INTO spots (
  id, title_ja, title_en, short_description_ja, short_description_en,
  description_ja, description_en, images, location_lat, location_lng,
  location_hide_exact, location_address_ja, location_address_en,
  primary_category, genre, travel_style, solo_friendly,
  business_hours_ja, business_hours_en, access_ja, access_en,
  tips_ja, tips_en, is_hidden, reactions_interested, reactions_visited,
  created_by, created_at
) VALUES
-- ここに既存データを変換して挿入
(...);
```

## 本番環境での設定

### Netlify環境変数

Netlify Dashboard > Site Settings > Environment variablesで：

- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase匿名キー

## トラブルシューティング

### よくあるエラー

1. **401 Unauthorized**
   - RLSが有効になっている場合は無効化
   - 匿名ユーザーのSELECT権限を確認

2. **CORS エラー**
   - NEXT_PUBLIC_ プレフィックスが正しいか確認
   - ブラウザでSupabase URLに直接アクセスできるか確認

3. **画像アップロードエラー**
   - Storageバケットが public に設定されているか確認
   - Storage policies が正しく設定されているか確認

### ログ確認

開発時は以下でログを確認：
- ブラウザのコンソール
- Supabase Dashboard > Logs
- ネットワークタブでAPI呼び出しを確認