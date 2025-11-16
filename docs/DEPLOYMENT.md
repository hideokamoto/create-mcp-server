# Deployment Guide

このドキュメントサイトは、Cloudflare Pagesに自動デプロイされます。

## 自動デプロイ（推奨）

GitHub Actionsを使用した自動デプロイが設定されています。

### トリガー条件

以下のタイミングで自動的にビルド&デプロイが実行されます：

- `main`ブランチへのプッシュ
- 新しいリリースの公開
- 手動トリガー（GitHub Actionsページから）

### 初回セットアップ

1. **Cloudflare Pages プロジェクトを作成**
   - Cloudflareダッシュボードにアクセス
   - Pages > Create a project
   - プロジェクト名: `create-mcp-tools-docs`

2. **Cloudflare API トークンを取得**
   - Cloudflare Profile > API Tokens
   - Create Token > Edit Cloudflare Pages を選択
   - Account Resources: 該当アカウントを選択
   - Zone Resources: All zones
   - トークンをコピー

3. **GitHubシークレットを設定**

   リポジトリの Settings > Secrets and variables > Actions で以下を追加:

   - `CLOUDFLARE_API_TOKEN`: 上記で作成したAPIトークン
   - `CLOUDFLARE_ACCOUNT_ID`: CloudflareのAccount ID
     - ダッシュボードのURLから取得: `dash.cloudflare.com/[Account ID]`

4. **完了！**

   これで、`main`ブランチへのプッシュや新しいリリースの公開時に、自動的にドキュメントサイトが更新されます。

## 手動デプロイ

### 方法1: GitHub Actionsから手動実行

1. GitHubリポジトリの Actions タブを開く
2. "Deploy Documentation" ワークフローを選択
3. "Run workflow" ボタンをクリック

### 方法2: ローカルからWranglerでデプロイ

```bash
cd docs
npm install
npm run build
npx wrangler pages deploy dist --project-name=create-mcp-tools-docs
```

初回は認証が必要です：
```bash
npx wrangler login
```

## データの更新

GitHubのリリースノートとREADMEは、ビルド時に自動的に取得されます。

- **リリース情報**: GitHub APIから最新5件を取得
- **README**: リポジトリルートの `README.md` を読み込み

ビルドスクリプト: `docs/scripts/fetch-github-data.js`

## カスタムドメインの設定

1. Cloudflare Pagesプロジェクトの設定を開く
2. Custom domains > Set up a custom domain
3. ドメインを入力してDNS設定を完了

## トラブルシューティング

### ビルドが失敗する

- Node.jsのバージョンを確認（20以上を推奨）
- `docs/package-lock.json` が最新か確認
- GitHub Actionsのログを確認

### GitHubデータが取得できない

- GitHub APIのレート制限に達していないか確認
- リポジトリが公開されているか確認
- `scripts/fetch-github-data.js` のリポジトリ名を確認

### デプロイはされるがサイトが表示されない

- Cloudflare Pagesのプロジェクト名が正しいか確認
- ビルド出力ディレクトリが `dist` になっているか確認
- wrangler.tomlの設定を確認
