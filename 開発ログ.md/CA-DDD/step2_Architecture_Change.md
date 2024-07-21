# ステップ2: Clean Architecture + DDDの導入

## 概要
このステップでは、既存のReact NativeプロジェクトをClean Architecture + DDDの基本的なディレクトリ構造に変更しました。必要なファイルとフォルダを作成し、プロジェクトの基盤を整えました。

## 手順

### 1. ディレクトリ構造の変更
- 新しいディレクトリ構造を作成し、既存のファイルを適切な場所に移動

```shell
src/
├── application
│   └── usecases
│       ├── AddFlightRecordUseCase.ts
│       ├── ExportFlightLogsUseCase.ts
│       └── GetFlightLogsUseCase.ts
├── assets
├── components
│   ├── FlightLogItem.tsx
│   ├── FlightLogList.tsx
│   └── Header.tsx
├── domain
│   ├── models
│   │   └── FlightLog.ts
│   ├── repositories
│   │   └── FlightLogRepository.ts
│   └── services
├── infrastructure
│   └── repositories
│       ├── FileSystemFlightLogRepository.ts
│       └── Storage.ts
├── navigation
│   └── AppNavigator.tsx
└── presentation
    └── screens
        ├── AddRecordScreen.tsx
        ├── DetailScreen.tsx
        ├── ExportScreen.tsx
        └── HomeScreen.tsx
