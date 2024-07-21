# Step5_Infrastructure_Layer.md

## リポジトリの実装

1. `FileSystemFlightLogRepository` の作成

   `src/infrastructure/repositories/FileSystemFlightLogRepository.ts` を作成し、以下の内容を追加します。

   ```typescript
   // src/infrastructure/repositories/FileSystemFlightLogRepository.ts
   import RNFS from 'react-native-fs';
   import { FlightLog } from '../../domain/models/FlightLog';
   import { FlightLogRepository } from '../../domain/repositories/FlightLogRepository';

   const directoryPath = `${RNFS.DownloadDirectoryPath}/flightReport`;
   const logsPath = `${directoryPath}/flight_logs.json`;
   const exportPath = `${directoryPath}/flight_logs.csv`;

   const ensureDirectoryExists = async () => {
     const exists = await RNFS.exists(directoryPath);
     if (!exists) {
       await RNFS.mkdir(directoryPath);
     }
   };

   const ensureFileExists = async (filePath: string, defaultContent: any) => {
     const exists = await RNFS.exists(filePath);
     if (!exists) {
       await RNFS.writeFile(filePath, JSON.stringify(defaultContent));
     }
   };

   export class FileSystemFlightLogRepository implements FlightLogRepository {
     async loadFlightLogs(): Promise<FlightLog[]> {
       await ensureDirectoryExists();
       await ensureFileExists(logsPath, []);
       const contents = await RNFS.readFile(logsPath);
       return JSON.parse(contents);
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
       console.log('Exported to:', exportPath);
     }

     private jsonToCSV(json: FlightLog[]): string {
       const csvRows: string[] = [];
       const headers = Object.keys(json[0]);
       csvRows.push(headers.join(','));

       for (const row of json) {
         const values = headers.map(header => {
           const escaped = ('' + row[header as keyof typeof row]).replace(
             /"/g,
             '\\"'
           );
           return `"${escaped}"`;
         });
         csvRows.push(values.join(','));
       }

       return csvRows.join('\n');
     }
   }


2. ストレージ関連の実装
`Storage` の役割は `FileSystemFlightLogRepository` に引き継がれたため、 `Storage` ファイルは削除します。

`Storage.ts` の削除

```bash
rm src/infrastructure/repositories/Storage.ts
```

これにより、 Storage に関連する全てのインポートステートメントを削除または更新します。

インポートステートメントの更新
全てのコンポーネントやファイルで `Storage` を使っていた部分を `FileSystemFlightLogRepository` に変更します。以下は `HomeScreen.tsx` の例です。

```typescript

// src/presentation/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlightLog } from '../../domain/models/FlightLog';
import { FileSystemFlightLogRepository } from '../../infrastructure/repositories/FileSystemFlightLogRepository';
import { GetFlightLogsUseCase } from '../../application/usecases/GetFlightLogsUseCase';

type RootStackParamList = {
  Home: undefined;
  Detail: { record: FlightLog };
  AddRecord: undefined;
  Export: undefined;
};

function HomeScreen() {
  const [records, setRecords] = useState<FlightLog[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const repository = new FileSystemFlightLogRepository();
  const getFlightLogsUseCase = new GetFlightLogsUseCase(repository);

  useEffect(() => {
    const loadLogs = async () => {
      const data = await getFlightLogsUseCase.execute();
      setRecords(data);
    };
    loadLogs();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Flight Records</Text>
      {records.map((record, index) => (
        <Text key={index} onPress={() => navigation.navigate('Detail', { record })}>
          {record.details}
        </Text>
      ))}
      <Button
        title="Add New Record"
        onPress={() => navigation.navigate('AddRecord')}
      />
      <Button
        title="Export Flight Logs"
        onPress={() => navigation.navigate('Export')}
      />
    </View>
  );
}

export default HomeScreen;
```

