# AIツールプラットフォーム

Next.js 14で構築されたAIツールプラットフォームです。

## 機能

- URL要約: URLの内容をスクレイピングして要約
- 営業メール評価: 営業メールを評価して改善点を提案
- CHUNK付与: 文章にCHUNKを付与

## 技術スタック

- Next.js 14
- TypeScript
- Tailwind CSS
- Dify API

## 開発環境のセットアップ

1. リポジトリのクローン:
```bash
git clone [リポジトリURL]
cd [プロジェクトディレクトリ]
```

2. 依存関係のインストール:
```bash
npm install
```

3. 環境変数の設定:
`.env.local`ファイルを作成し、必要な環境変数を設定:
```
NEXT_PUBLIC_DIFY_API_BASE_URL=https://dify.pepalab.com
NEXT_PUBLIC_URL_ANALYZER_API_KEY=your_key_here
NEXT_PUBLIC_EMAIL_EVALUATOR_API_KEY=your_key_here
NEXT_PUBLIC_CHUNK_GENERATOR_API_KEY=your_key_here
```

4. 開発サーバーの起動:
```bash
npm run dev
```

## 本番環境へのデプロイ

1. ビルド:
```bash
npm run build
```

2. 起動:
```bash
npm start
```

## ライセンス

このプロジェクトはプライベートリポジトリとして管理されています。