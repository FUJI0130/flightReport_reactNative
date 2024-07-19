# ステップ6: 新しい飛行記録の追加機能

### 目的
- AddRecordScreenを実装し、新しい飛行記録を追加する機能を実装する。

### 実装手順

1. `AddRecordScreen.tsx`を作成する。
    ```typescript
    // src/screens/AddRecordScreen.tsx
    import React, { useState } from 'react';
    import { View, Text, TextInput, Button } from 'react-native';
    import Storage from '../storage/Storage';
    import { useNavigation } from '@react-navigation/native';

    const AddRecordScreen: React.FC = () => {
      const [details, setDetails] = useState('');
      const navigation = useNavigation();

      const handleSave = async () => {
        await Storage.saveFlightLog({ details });
        console.log('Saved Record:', details);
        navigation.goBack();
      };

      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text>Add New Flight Record</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '100%', marginBottom: 20, padding: 10 }}
            placeholder="Flight Details"
            value={details}
            onChangeText={setDetails}
          />
          <Button title="Save Record" onPress={handleSave} />
        </View>
      );
    };

    export default AddRecordScreen;
    ```

2. `HomeScreen.tsx`を修正して、新しい飛行記録を追加するボタンを実装する。
    ```typescript
    // src/screens/HomeScreen.tsx
    import React, { useEffect, useState } from 'react';
    import { View, Text, Button } from 'react-native';
    import { useNavigation, NavigationProp } from '@react-navigation/native';
    import Storage from '../storage/Storage';

    type Record = {
      key: string;
      details: string | null;
    };

    type RootStackParamList = {
      Home: undefined;
      Detail: { record: Record };
      AddRecord: undefined;
    };

    function HomeScreen() {
      const [records, setRecords] = useState<Record[]>([]);
      const navigation = useNavigation<NavigationProp<RootStackParamList>>();

      useEffect(() => {
        const loadLogs = async () => {
          const data: Record[] = await Storage.loadFlightLogs();
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
        </View>
      );
    }

    export default HomeScreen;
    ```

3. `Storage.ts`を修正し、新しい飛行記録を保存する機能を実装する。
    ```typescript
    // src/storage/Storage.ts
    import RNFS from 'react-native-fs';

    const directoryPath = `${RNFS.DocumentDirectoryPath}/flightReport`;
    const logsPath = `${directoryPath}/flight_logs.json`;

    const ensureDirectoryExists = async () => {
      try {
        const exists = await RNFS.exists(directoryPath);
        if (!exists) {
          await RNFS.mkdir(directoryPath);
        }
      } catch (e) {
        console.error('Error ensuring directory exists:', e);
        throw e;
      }
    };

    const ensureFileExists = async (filePath: string, defaultContent: any) => {
      try {
        const exists = await RNFS.exists(filePath);
        if (!exists) {
          await RNFS.writeFile(filePath, JSON.stringify(defaultContent));
        }
      } catch (e) {
        console.error('Error ensuring file exists:', e);
        throw e;
      }
    };

    const loadFlightLogs = async (): Promise<{key: string; details: string | null}[]> => {
      try {
        await ensureDirectoryExists();
        await ensureFileExists(logsPath, []);
        const contents = await RNFS.readFile(logsPath);
        return JSON.parse(contents);
      } catch (e) {
        console.error('Error loading flight logs:', e);
        return [];
      }
    };

    const saveFlightLog = async (newLog: any) => {
      try {
        await ensureDirectoryExists();
        const contents = await RNFS.readFile(logsPath);
        const flightLogs = JSON.parse(contents);
        flightLogs.push(newLog);
        await RNFS.writeFile(logsPath, JSON.stringify(flightLogs));
      } catch (e) {
        console.error('Error saving flight log:', e);
        throw e;
      }
    };

    export default {
      loadFlightLogs,
      saveFlightLog,
    };
    ```

### 変更点
- `AddRecordScreen.tsx`を作成して、新しい飛行記録を追加する機能を実装した。
- `HomeScreen.tsx`で新しい飛行記録を追加するボタンを実装した。
- `Storage.ts`を修正して、新しい飛行記録を保存する機能を実装した。
