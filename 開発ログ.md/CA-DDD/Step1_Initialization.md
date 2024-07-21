# ステップ1: プロジェクトの初期化

## 概要
このステップでは、既存のReact Nativeプロジェクトのセットアップと動作確認を行いました。また、初期のディレクトリ構造を確認し、バックアップを作成しました。

## 手順

### 1. プロジェクトのセットアップ
- 必要なパッケージと依存関係のインストール
- 環境設定と必要なツールのインストール

### 2. プロジェクトの動作確認
- プロジェクトをビルドし、エミュレータまたは実機で動作を確認
- 初期状態でのアプリの機能を確認

### 3. 初期のディレクトリ構造の確認
- プロジェクトのディレクトリ構造を確認し、重要なファイルとフォルダをバックアップ

```shell
├── .bundle
│   └── config
├── .eslintrc.js
├── .gitignore
├── .prettierrc.js
├── .watchmanconfig
├── Gemfile
├── README.md
├── __tests__
│   └── App.test.tsx
├── app.json
├── babel.config.js
├── index.js
├── jest.config.js
├── makefile
├── metro.config.js
├── package-lock.json
├── package.json
├── src
│   ├── App.tsx
│   ├── assets
│   ├── components
│   ├── domain
│   │   ├── models
│   │   ├── repositories
│   │   └── services
│   ├── infrastructure
│   │   ├── repositories
│   │   └── Storage.ts
│   ├── navigation
│   │   └── AppNavigator.tsx
│   └── presentation
│       ├── screens
│           ├── AddRecordScreen.tsx
│           ├── DetailScreen.tsx
│           ├── ExportScreen.tsx
│           └── HomeScreen.tsx
├── storage
├── tsconfig.json
├── 解決したい課題
├── 開発ログ.md
├── milestone3
└── 開発中の不具合解決
