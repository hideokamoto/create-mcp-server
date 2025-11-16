# create-mcp-tools Documentation Site

このディレクトリには、create-mcp-toolsの静的ドキュメントサイトが含まれています。

Astroで構築され、GitHubのリリースノートとREADMEを動的に取得して表示します。

## 開発

### セットアップ

```bash
cd docs
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:4321` を開くとサイトをプレビューできます。

### ビルド

```bash
npm run build
```

このコマンドは以下を実行します：
1. GitHubからリリースノートとREADMEを取得 (`scripts/fetch-github-data.js`)
2. Astroで静的サイトをビルド
3. `dist/` ディレクトリに出力

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

5. ビルドしてデプロイ:
```bash
npm run build
wrangler deploy
```

## ファイル構成

```
docs/
├── src/
│   ├── pages/           # ページファイル
│   │   ├── index.astro  # 英語版トップページ
│   │   └── ja/
│   │       └── index.astro  # 日本語版トップページ
│   ├── layouts/         # レイアウトコンポーネント
│   ├── components/      # 再利用可能なコンポーネント
│   ├── data/           # GitHubから取得したデータ
│   └── scripts/        # ビルドスクリプト
├── scripts/
│   └── fetch-github-data.js  # GitHubデータ取得スクリプト
├── astro.config.mjs    # Astro設定
├── wrangler.toml       # Cloudflare Workers設定
└── package.json

```

## 多言語対応

- 英語: `/` (デフォルト)
- 日本語: `/ja`

## 注意事項

このディレクトリはnpmパッケージには含まれません。親ディレクトリの`.npmignore`で除外されています。
