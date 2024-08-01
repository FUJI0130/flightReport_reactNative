## フライトレポートReact Nativeアプリケーションの開発ログ
- 日付: 2024年7月27日
1. 初期設定
- 設定ファイル:
```
.eslintrc.js
.prettierrc.js
.gitignore
app.json
babel.config.js
index.js
jest.config.js
metro.config.js
tsconfig.json
package.json
```

2. ディレクトリ構造
```
src/
├── App.tsx
├── application/
│   └── usecases/
│       ├── AddFlightRecordUseCase.ts
│       ├── ExportFlightLogsUseCase.ts
│       └── GetFlightLogsUseCase.ts
├── assets/
├── components/
│   ├── FileSelectionDialog.tsx
│   ├── FlightLogItem.tsx
│   ├── FlightLogList.tsx
│   └── Header.tsx
├── context/
│   └── FileContext.tsx
├── domain/
│   ├── models/
│   │   └── FlightLog.ts
│   ├── repositories/
│   │   ├── FlightLogRepository.ts
│   │   └── IDataStore.ts
│   └── services/
├── infrastructure/
│   └── repositories/
│       ├── CSVFlightLogRepository.ts
│       ├── FileSystemFlightLogRepository.ts
│       ├── FlightLogRepositoryFactory.ts
│       ├── JSONFlightLogRepository.ts
│       └── Storage.ts
├── navigation/
│   ├── AppNavigator.tsx
│   └── ParamList.ts
├── presentation/
│   └── screens/
│       ├── AddRecordScreen.tsx
│       ├── DetailScreen.tsx
│       ├── ExportScreen.tsx
│       ├── FlightRecordsScreen.tsx
│       ├── HomeScreen.tsx
│       └── NewFlightLogScreen.tsx
└── utils/
    └── flightLogUtils.ts
```

3. 開発中の問題と解決策
3.1 ファイルパスエラー
- 問題: 新しいフライトログを作成する際に、誤ったファイルパスが生成されていた。
- 原因: ファイルパスに二重スラッシュ（//）が含まれていたため。
- 解決策:
 
```typescript
async load(fileName: string): Promise<FlightLog[]> {
  await ensureDirectoryExists();
  const filePath = fileName.includes(RNFS.DownloadDirectoryPath) ? fileName : `${directoryPath}/${fileName}`;
  console.log(`Loading file: ${filePath}`);
  const exists = await RNFS.exists(filePath);
  if (!exists) {
    throw new Error(`File does not exist: ${filePath}`);
  }
  return await loadCSVFlightLogsFromFile(filePath);
}
```

3.2 ナビゲーション中のファイル名の正しい渡し方
- 問題: 新しいファイルを作成した後、誤ったファイルパスが渡されていた。
- ※多分flightReportのディレクトリをきちんと設定してなかった？
- 解決策:
```typescript
const handleSave = async () => {
  const repository = await createFlightLogRepository();
  const newLog: FlightLog = {
    key: new Date().toISOString(),
    date: new Date().toISOString(),
    pilotName: 'Test Pilot',
    registrationNumber: 'ABC123',
    flightPurposeAndRoute: details,
    takeoffLocationAndTime: 'Location A',
    landingLocationAndTime: 'Location B',
    flightDuration: '1h',
    issues: 'None',
  };

  const finalFileName = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
  const filePath = `${RNFS.DownloadDirectoryPath}/flightReport/${finalFileName}`;
  console.log(`Creating new file: ${filePath}`);

  try {
    await repository.save(newLog, finalFileName);
    navigation.reset({
      index: 1,
      routes: [
        { name: 'Home' },
        { name: 'FlightRecords', params: { newFileName: finalFileName } },
      ],
    });
  } catch (error) {
    Alert.alert('エラー', 'ファイルの保存に失敗しました');
    console.error('File save error:', error);
  }
};
```
4. 結果
- ファイルパスの構築を正しく行い、ナビゲーション中に適切なファイル名を渡すことで、ファイルパスエラーとファイルが見つからないエラーを解決。
新しいフライトログを正しく作成および読み込みが可能となった。
