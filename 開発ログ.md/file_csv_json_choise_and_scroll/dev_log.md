# 開発ログ


# 開発ログ（要約）

## 複数ファイルの選択機能とスクロール機能の実装

1. **ファイル優先順位の設定とエラーハンドリング**
   - 設定ファイルから優先順位を読み込み、CSVファイルとJSONファイルのどちらを優先して読み込むかを決定する機能を追加。
   - 設定ファイルに対応していない形式が指定されている場合のエラーハンドリングを追加。

2. **スクロール機能の追加**
   - リストがスクロール可能になるように `ScrollView` を追加し、リスト全体を表示できるように改善。

3. **エラーと警告の解消**
   - `error` 変数の型を `unknown` から `Error` に変更し、型指定のエラーハンドリングを追加。
   - `file` パラメータの型を `string` に指定し、警告を解消。

4. **ファイル名の表示**
   - ファイルパスではなくファイル名のみを表示するように変更。ファイルパスからファイル名を抽出する関数 `extractFileName` を追加し、アラートでファイル名のみを表示するように修正。

## 実装手順の流れ

1. 設定ファイルから優先順位を読み込み、ファイル形式を決定する。
2. ファイル形式に応じてディレクトリ内のファイルを検出する。
3. 複数ファイルが検出された場合、ユーザーに選択させるためのダイアログを表示する。
4. ユーザーが選択したファイルを読み込み、リストに表示する。
5. リストがスクロール可能になるように `ScrollView` を追加する。
6. ファイル名のみを表示するように修正し、セキュリティを向上させる。
7. 型指定のエラーと警告を解消し、コードの品質を向上させる。

## 結果

- 複数ファイルの選択後、ファイルの内容が正しく表示されることを確認。
- リストがスクロール可能になり、全てのデータを表示できるようになった。
- ファイルパスではなくファイル名のみが表示されるようになった。


## 複数ファイルの選択機能とスクロール機能の実装

### 1. ファイル優先順位の設定とエラーハンドリング

#### 修正内容
- 設定ファイルから優先順位を読み込み、CSVファイルとJSONファイルのどちらを優先して読み込むかを決定する。
- 設定ファイルに対応していない形式が指定されている場合のエラーハンドリングを追加。
#### ファイル: `src/infrastructure/repositories/FileSystemFlightLogRepository.ts`
#### コード
```typescript
import RNFS from 'react-native-fs';
import { FlightLog } from '../../domain/models/FlightLog';
import { FlightLogRepository } from '../../domain/repositories/FlightLogRepository';
import { getFilesWithExtension, loadCSVFlightLogsFromFile, loadJSONFlightLogsFromFile } from '../../utils/flightLogUtils';

const directoryPath = `${RNFS.DownloadDirectoryPath}/flightReport`;
const logsPath = `${directoryPath}/flight_logs.json`;
const exportPath = `${directoryPath}/flight_logs.csv`;
const settingsPath = `${directoryPath}/settings.json`;

const ensureSettingsFileExists = async () => {
  const exists = await RNFS.exists(settingsPath);
  if (!exists) {
    await RNFS.writeFile(settingsPath, JSON.stringify({}));
  }
};

export const loadSettings = async (): Promise<any> => {
  await ensureSettingsFileExists();
  const contents = await RNFS.readFile(settingsPath);
  return JSON.parse(contents);
};

const ensureDirectoryExists = async () => {
  const exists = await RNFS.exists(directoryPath);
  if (!exists) {
    await RNFS.mkdir(directoryPath);
  }
};

export class FileSystemFlightLogRepository implements FlightLogRepository {
  async loadFlightLogs(): Promise<FlightLog[]> {
    await ensureDirectoryExists();
    const settings = await loadSettings();
    const priority = settings.priority || 'csv'; // デフォルトはCSV優先

    if (priority === 'csv') {
      const csvFiles = await getFilesWithExtension('.csv');
      if (csvFiles.length === 1) {
        return await loadCSVFlightLogsFromFile(csvFiles[0]);
      } else if (csvFiles.length > 1) {
        // 複数のCSVファイルが存在する場合に選択を要求
        throw new Error(`複数のCSVファイルが見つかりました: ${csvFiles.join(', ')}`);
      }
    } else if (priority === 'json') {
      const jsonFiles = await getFilesWithExtension('.json');
      if (jsonFiles.length === 1) {
        return await loadJSONFlightLogsFromFile(jsonFiles[0]);
      } else if (jsonFiles.length > 1) {
        // 複数のJSONファイルが存在する場合に選択を要求
        throw new Error(`複数のJSONファイルが見つかりました: ${jsonFiles.join(', ')}`);
      }
    } else {
      throw new Error(`設定ファイルのpriorityに対応外のファイル形式が指定されています: ${priority}. 'csv' または 'json' のいずれかを指定してください。`);
    }

    // CSVもJSONも存在しない場合は空の配列を返す
    return [];
  }

  async saveFlightLog(newLog: FlightLog): Promise<void> {
    await ensureDirectoryExists();
    const contents = await RNFS.readFile(logsPath);
    const flightLogs = JSON.parse(contents);
    flightLogs.push(newLog);
    await RNFS.writeFile(logsPath, JSON.stringify(flightLogs));
  }

  async exportFlightLogsToCSV(): Promise<void> {
    const flightLogs = await this.loadFlightLogs();
    if (flightLogs.length === 0) {
      throw new Error('No flight logs available to export');
    }
    const csv = this.jsonToCSV(flightLogs);
    await RNFS.writeFile(exportPath, csv);
  }

  private jsonToCSV(json: FlightLog[]): string {
    const csvRows: string[] = [];
    const headers = Object.keys(json[0]);
    csvRows.push(headers.join(','));

    for (const row of json) {
      const values = headers.map(header => {
        const escaped = ('' + row[header as keyof FlightLog]).replace(
          /"/g,
          '\\"',
        );
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  // 追加: CSVファイルを読み込むメソッド
  public async loadCSVFlightLogsFromFile(filePath: string): Promise<FlightLog[]> {
    return loadCSVFlightLogsFromFile(filePath);
  }

  // 追加: JSONファイルを読み込むメソッド
  public async loadJSONFlightLogsFromFile(filePath: string): Promise<FlightLog[]> {
    return loadJSONFlightLogsFromFile(filePath);
  }
}
```
### 2. スクロール機能の追加
修正内容
リストがスクロール可能になるように ScrollView を追加。

#### ファイル: `src/presentation/screens/HomeScreen.tsx`

```typescript

import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlightLog } from '../../domain/models/FlightLog';
import { FileSystemFlightLogRepository } from '../../infrastructure/repositories/FileSystemFlightLogRepository';
import { GetFlightLogsUseCase } from '../../application/usecases/GetFlightLogsUseCase';
import FlightLogList from '../../components/FlightLogList';
import Header from '../../components/Header';

type RootStackParamList = {
  Home: undefined;
  Detail: { record: FlightLog };
  AddRecord: undefined;
  Export: undefined;
};

// ファイルパスからファイル名を抽出する関数
const extractFileName = (filePath: string): string => {
  return filePath.split('/').pop() || filePath;
};

function HomeScreen() {
  const [records, setRecords] = useState<FlightLog[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const repository = new FileSystemFlightLogRepository();
  const getFlightLogsUseCase = new GetFlightLogsUseCase(repository);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await getFlightLogsUseCase.execute();
        setRecords(data);
      } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('複数の')) {
          const files = error.message.split(': ')[1].split(', ');
          Alert.alert(
            'ファイル選択',
            '読み込むファイルを選択してください。',
            files.map((file: string) => ({
              text: extractFileName(file),
              onPress: async () => {
                try {
                  const data = await (file.endsWith('.csv')
                    ? repository.loadCSVFlightLogsFromFile(file)
                    : repository.loadJSONFlightLogsFromFile(file));
                  setRecords(data);
                } catch (e) {
                  console.error(e);
                }
              },
            })),
          );
        } else {
          console.error(error);
        }
      }
    };
    loadLogs();
  }, []);

  const handleLogPress = (record: FlightLog) => {
    navigation.navigate('Detail', { record });
  };

  return (
    <View style={styles.container}>
      <Header title="Flight Records" />
      <ScrollView style={styles.scrollContainer}>
        {records.length > 0 ? (
          <FlightLogList logs={records} onLogPress={handleLogPress} />
        ) : (
          <Text>No records found</Text>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          title="Add New Record"
          onPress={() => navigation.navigate('AddRecord')}
        />
        <Button
          title="Export Flight Logs"
          onPress={() => navigation.navigate('Export')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default HomeScreen;
```

## 結果
- リストがスクロール可能になり、複数ファイルの選択後の中身の確認もできました。
- ファイルパスが表示される代わりに、ファイル名のみが表示されるように修正しました。

## 最終確認
- スクロール確認および複数ファイルの選択後の中身の確認ができました。
- 動作確認も完了し、修正内容が正しく反映されていることを確認しました。