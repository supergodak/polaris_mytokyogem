-- 本番環境のRLS問題を解決するため一時的に無効化
-- SupabaseのSQL Editorで実行してください

-- RLSを無効化
ALTER TABLE spots DISABLE ROW LEVEL SECURITY;

-- データ確認用クエリ
SELECT COUNT(*) as total_spots FROM spots;
SELECT COUNT(*) as public_spots FROM spots WHERE is_hidden = FALSE;
SELECT id, title_ja, is_hidden FROM spots ORDER BY created_at DESC;