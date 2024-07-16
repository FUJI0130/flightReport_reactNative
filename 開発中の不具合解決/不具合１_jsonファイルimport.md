# 不具合ログ

## 不具合1: JSONファイルのインポートエラー

### 発生日時
2024-07-16

### 概要
`tsconfig.json` の設定不足により、JSONファイルをインポートする際にエラーが発生。

### エラーメッセージ
モジュール '/app.json' が見つかりません。 '--resolveJsonModule' を使用して '.json' 拡張子を持つモジュールをインポートすることをご検討ください。

### 原因
`tsconfig.json` ファイルで `resolveJsonModule` オプションが有効になっていなかった。

### 解決策

`tsconfig.json`（プロジェクトルート）を以下のように更新：
```
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```
