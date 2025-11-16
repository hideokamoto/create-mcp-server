# create-mcp-tools Documentation Site

このディレクトリには、create-mcp-toolsの静的ドキュメントサイトが含まれています。

## デプロイ方法

### Cloudflare Workersへのデプロイ

1. Cloudflare Workersアカウントを作成（まだの場合）

2. Wranglerをインストール:
```bash
npm install -g wrangler
```

3. Cloudflareにログイン:
```bash
wrangler login
```

4. `wrangler.toml`を編集して、`routes`のzone_nameを自分のドメインに変更

5. デプロイ:
```bash
cd docs
wrangler deploy
```

### ローカルでのプレビュー

```bash
cd docs
wrangler dev
```

ブラウザで `http://localhost:8787` を開くとサイトをプレビューできます。

## ファイル構成

- `index.html` - メインのランディングページ
- `wrangler.toml` - Cloudflare Workers設定ファイル
- `README.md` - このファイル

## 注意事項

このディレクトリはnpmパッケージには含まれません。`package.json`の`files`フィールドで除外されています。
