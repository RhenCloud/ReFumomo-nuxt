# Haku Fumomo - 個人ホームページ

Nuxt 4 + Vue 3 + Tailwind CSSで構築された、RSSによる記事購読機能をサポートするモダンな個人ホームページです。

## 機能

- レスポンシブレイアウト対応のモダンなデザイン
- モバイルフレンドリー
- RSS記事購読機能
- Nuxt 4ベースの優れたパフォーマンス
- TypeScriptサポート
- Tailwind CSSによるスタイリング

## 技術スタック

- **フロントエンドフレームワーク**: Nuxt 4 + Vue 3
- **スタイリング**: Tailwind CSS v3
- **型付け**: TypeScript
- **デプロイ**: Vercel
- **RSS解析**: fast-xml-parser

## インストールと実行

### ローカル開発

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# http://localhost:3000 にアクセス
```

### 本番ビルド

```bash
# プロジェクトのビルド
pnpm build

# ビルド結果のプレビュー
pnpm preview
```

## Vercelへのデプロイ

### 自動デプロイ（推奨）

1. コードをGitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com)でGitHubリポジトリをインポート
3. VercelがNuxtプロジェクトを自動検出しデプロイ
4. デプロイ後、`.vercel.app`ドメインが取得できます

### 手動デプロイ

```bash
# Vercel CLIのインストール
npm i -g vercel

# デプロイ
vercel --prod
```

## 設定



### 個人情報

`app/config/index.ts`で個人情報を変更します：

```typescript
personal: {
  name: "あなたの名前",
  nickname: "ニックネーム",
  bio: "自己紹介",
  avatar: "アバターURL",
  social: {
    github: "https://github.com/your-username",
    email: "your-email@example.com"
  }
}
```

## プロジェクト構造

```
fumomo-nuxt/
├── app/
│   ├── assets/
│   │   └── styles/          # グローバルスタイル
│   ├── components/          # Vueコンポーネント
│   ├── config/
│   │   └── index.ts         # サイト設定
│   ├── layouts/
│   │   └── default.vue      # デフォルトレイアウト
│   └── pages/               # ペイジルート
├── server/
│   └── api/
│       └── rss.get.ts       # RSS APIルート
├── public/                  # 静的アセット
├── nuxt.config.ts           # Nuxt設定
└── package.json
```

## カスタマイズ

### テーマカラー

`app/config/index.ts`の`theme`セクションを変更します：

```typescript
theme: {
  primaryColor: "#8b5a8c",
  secondaryColor: "#f0f9ff",
  accentColor: "#ffeef8",
  textColor: "#666",
  fontFamily: "'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif"
}
```

### ナビゲーションメニュー

`app/config/index.ts`の`navigation`セクションを変更します：

```typescript
navigation: [
  { name: "ホーム", href: "/", key: "home"},
  { name: "記事", href: "/articles", key: "articles"},
  { name: "私について", href: "/about", key: "about"},
  // ナビゲーション項目を追加...
]
```

## RSS機能

外部ブログからRSSデータを取得し、記事ページに表示する機能をサポートしています：

1. **RSSデータ取得**: `/api/rss`エンドポイント経由で取得
2. **XML解析**: `fast-xml-parser`を使用してRSS XMLを解析
3. **自動ページネーション**: 記事リストのページ分割表示をサポート
4. **エラーハンドリング**: ネットワークエラー時にフレンドリーなエラーメッセージを表示
5. **キャッシュ最適化**: VercelがAPIレスポンスを自動的にキャッシュ

## Vercelデプロイ最適化

Vercelデプロイ用に最適化されています：

- `vercel-edge`プリセットを使用しパフォーマンスを向上
- ホームページをプリレンダリングしSEOを向上
- 静的アセットを自動的にキャッシュ
- Serverless Functionsをサポート

## ライセンス

MITライセンス

## 貢献

IssueやPull Requestを歓迎します！

---

このプロジェクトが役立ったら、ぜひStarを付けてください！
