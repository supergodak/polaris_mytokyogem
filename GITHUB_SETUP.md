# GitHub API 設定手順

本番環境でスポット登録を可能にするための設定手順です。

## 1. GitHub Personal Access Token の作成

1. GitHubにログイン
2. 右上のプロフィールアイコン → Settings
3. 左メニューの一番下 → Developer settings
4. Personal access tokens → Tokens (classic)
5. 「Generate new token」→「Generate new token (classic)」をクリック
6. 設定：
   - **Note**: `MyTokyoGem Production`
   - **Expiration**: `No expiration` または適切な期限
   - **スコープ**: 以下にチェック
     - `repo` （全てにチェックが入ります）
7. 「Generate token」をクリック
8. **生成されたトークンをコピー**（一度しか表示されません！）

## 2. Netlify環境変数の設定

1. Netlifyダッシュボードにログイン
2. サイトを選択
3. Site settings → Environment variables
4. 「Add variable」をクリック
5. 以下を追加：

```
Key: GITHUB_TOKEN
Value: [コピーしたトークン]
```

```
Key: GITHUB_OWNER
Value: supergodak
```

```
Key: GITHUB_REPO
Value: polaris_mytokyogem
```

6. 「Save」をクリック

## 3. デプロイ

環境変数を追加したら、Netlifyで再デプロイが必要です：

1. Deploys → Trigger deploy → Deploy site

## 4. 動作確認

1. https://mygem.hitoriasobi.life/admin にアクセス
2. 新規スポット登録を試す
3. 2-3分後に本番サイトに反映されることを確認

## セキュリティについて

- GitHub Personal Access Tokenは**絶対に**公開しないでください
- トークンは定期的に更新することをお勧めします
- 不要になったトークンは削除してください

## トラブルシューティング

### 「GitHub token is not configured」エラー
→ 環境変数が正しく設定されていません。Netlifyで確認してください。

### 「Not Found」エラー
→ GITHUB_OWNER, GITHUB_REPOが正しいか確認してください。

### 反映されない
→ GitHub Actionsの実行状況を確認してください。