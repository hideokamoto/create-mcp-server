# Deployment Guide

このドキュメントサイトは、Cloudflare Workers Static Assetsを使用して自動デプロイされます。

## 自動デプロイ（推奨）

GitHub Actionsを使用した自動デプロイが設定されています。

### トリガー条件

以下のタイミングで自動的にビルド&デプロイが実行されます：

- `main`ブランチへのプッシュ
- 新しいリリースの公開
- 手動トリガー（GitHub Actionsページから）

### 初回セットアップ

1. **Cloudflare API トークンを取得**
   - Cloudflare Profile > API Tokens
   - Create Token > "Edit Cloudflare Workers" テンプレートを選択
   - Account Resources: 該当アカウントを選択
   - Zone Resources: All zones (または特定のゾーン)
   - トークンをコピー

2. **GitHubシークレットを設定**

   リポジトリの Settings > Secrets and variables > Actions で以下を追加:

   - `CLOUDFLARE_API_TOKEN`: 上記で作成したAPIトークン
   - `CLOUDFLARE_ACCOUNT_ID`: CloudflareのAccount ID
     - ダッシュボードのURLから取得: `dash.cloudflare.com/[Account ID]`

3. **設定ファイルの確認**

   `docs/wrangler.toml` の内容を確認:
   ```toml
   name = "create-mcp-tools-docs"  # 任意の名前に変更可能
   compatibility_date = "2024-01-01"

   [assets]
   directory = "dist"
   not_found_handling = "404-page"
   ```

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
npx wrangler deploy
```

初回は認証が必要です：
```bash
npx wrangler login
```

## Cloudflare Workers Static Assetsについて

このプロジェクトは、Cloudflare Workers の Static Assets 機能を使用しています。

### 特徴

- **高速**: Cloudflareのグローバルネットワークでコンテンツを配信
- **スケーラブル**: 自動的にスケール、トラフィック制限なし
- **シンプル**: Workerスクリプト不要で静的ファイルを直接配信
- **無料**: 静的アセットへのリクエストは無料

### 仕組み

1. Astroで静的サイトをビルド → `dist/` ディレクトリに出力
2. Wranglerが `dist/` 内のファイルをCloudflareにアップロード
3. Cloudflareが静的アセットを自動的に配信（Workerスクリプト不要）

## データの更新

GitHubのリリースノートとREADMEは、ビルド時に自動的に取得されます。

- **リリース情報**: GitHub APIから最新5件を取得
- **README**: リポジトリルートの `README.md` を読み込み

ビルドスクリプト: `docs/scripts/fetch-github-data.js`

### GitHub APIレート制限について

デフォルトでは未認証でGitHub APIにアクセスするため、1時間あたり60リクエストの制限があります。

**推奨**: GitHub Personal Access Tokenを設定してレート制限を回避（1時間あたり5,000リクエスト）

1. [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens) でトークンを作成
2. スコープ: `public_repo` （または読み取り専用でOK）
3. 環境変数に設定:
   - ローカル開発: `.env` ファイルに `GITHUB_TOKEN=your_token_here`
   - GitHub Actions: すでに `secrets.GITHUB_TOKEN` が自動的に利用可能
   - 本番ビルド: Cloudflare Workersの環境変数に設定（オプション）

## カスタムドメインの設定

### Workers.devサブドメイン

デプロイ後、自動的に `https://create-mcp-tools-docs.<your-subdomain>.workers.dev` でアクセス可能。

### カスタムドメイン

1. Cloudflareでドメインを管理
2. `wrangler.toml` に routes を追加:
   ```toml
   routes = [
     { pattern = "docs.example.com", custom_domain = true }
   ]
   ```
3. 再デプロイ: `npx wrangler deploy`

または、Cloudflare Dashboardから設定:
1. Workers & Pages > create-mcp-tools-docs
2. Settings > Triggers > Custom Domains
3. "Add Custom Domain" でドメインを追加

## ローカル開発

### 開発サーバー

```bash
cd docs
npm run dev
```

ブラウザで `http://localhost:4321` を開く

### Wranglerでローカルプレビュー

```bash
cd docs
npm run build
npx wrangler dev
```

実際のWorkers環境と同じようにローカルでテスト可能。

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

- `wrangler.toml` の設定を確認
- ビルド出力ディレクトリが `dist` になっているか確認
- Worker名が一意か確認
- Cloudflare Dashboardでデプロイログを確認

### Wranglerのデプロイエラー

```
Error: A request to the Cloudflare API failed.
```

- `CLOUDFLARE_API_TOKEN` が正しく設定されているか確認
- トークンに必要な権限があるか確認
- `CLOUDFLARE_ACCOUNT_ID` が正しいか確認

## コスト

Cloudflare Workersの無料プランでは:
- 100,000 リクエスト/日
- 静的アセットのストレージは無制限

通常のドキュメントサイトであれば、無料プラン内で運用可能です。

## 参考リンク

- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Astro Documentation](https://docs.astro.build/)
