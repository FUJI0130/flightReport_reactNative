# 開発ログ

## 概要
このログは、新規フライトログ作成機能の実装および詳細表示機能に関する開発プロセスを記録しています。主要な修正点や問題の解決手順を含みます。

---

## 1. 新規フライトログ作成画面の実装

### `NewFlightLogScreen.tsx`

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Header from '../../components/Header';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { createFlightLogRepository } from '../../infrastructure/repositories/FlightLogRepositoryFactory';
import { FlightLog } from '../../domain/flightlog/FlightLog';
import { FlightDate } from '../../domain/shared/valueObjects/FlightDate';
import { Location } from '../../domain/flightlog/valueObjects/Location';
import { FlightDuration } from '../../domain/flightlog/valueObjects/FlightDuration';
import RNFS from 'react-native-fs';
import { RootStackParamList } from '../../navigation/ParamList';

const NewFlightLogScreen: React.FC = () => {
  const [details, setDetails] = useState('');
  const [fileName, setFileName] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSave = async () => {
    const repository = await createFlightLogRepository();
    const newLog = new FlightLog(
      new Date().toISOString(),
      FlightDate.create(new Date().toISOString()),
      'Test Pilot',
      'ABC123',
      details,
      Location.create('Location A', '12:00'),
      Location.create('Location B', '13:00'),
      FlightDuration.create(60), // example duration in minutes
      'None'
    );

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

  return (
    <View style={styles.container}>
      <Header title="New Flight Log" />
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="File Name"
          value={fileName}
          onChangeText={setFileName}
        />
        <TextInput
          style={styles.input}
          placeholder="Flight Details"
          value={details}
          onChangeText={setDetails}
        />
        <Button title="Save Record" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    padding: 10,
  },
});

export default NewFlightLogScreen;
```


2. フライトログ詳細画面の実装
- DetailScreen.tsx
```typescript

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { FlightLog } from '../../domain/flightlog/FlightLog';
import Header from '../../components/Header';
import { RootStackParamList } from '../../navigation/ParamList';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { record } = route.params;

  return (
    <View style={styles.container}>
      <Header title="Detail Screen" />
      <View style={styles.content}>
        <Text style={styles.label}>Key:</Text>
        <Text style={styles.value}>{record.key}</Text>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{record.date.toString()}</Text>
        <Text style={styles.label}>Pilot Name:</Text>
        <Text style={styles.value}>{record.pilotName}</Text>
        <Text style={styles.label}>Registration Number:</Text>
        <Text style={styles.value}>{record.registrationNumber}</Text>
        <Text style={styles.label}>Flight Purpose and Route:</Text>
        <Text style={styles.value}>{record.flightPurposeAndRoute}</Text>
        <Text style={styles.label}>Takeoff Location and Time:</Text>
        <Text style={styles.value}>{record.takeoffLocationAndTime.location}, {record.takeoffLocationAndTime.time}</Text>
        <Text style={styles.label}>Landing Location and Time:</Text>
        <Text style={styles.value}>{record.landingLocationAndTime.location}, {record.landingLocationAndTime.time}</Text>
        <Text style={styles.label}>Flight Duration:</Text>
        <Text style={styles.value}>{record.flightDuration.toString()}</Text>
        <Text style={styles.label}>Issues:</Text>
        <Text style={styles.value}>{record.issues}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
});
export default DetailScreen;
```

1. バリューオブジェクトの実装
- FlightDate.ts
```typescript

import {BaseValueObject} from '../BaseValueObject';

interface FlightDateProps {
  value: string; // Use string to store date in ISO format
}

export class FlightDate extends BaseValueObject<FlightDateProps> {
  private constructor(props: FlightDateProps) {
    super(props);
    this.validate(props);
  }

  protected validate(props: FlightDateProps): void {
    if (!this.isValidDate(props.value)) {
      throw new Error('Invalid date format');
    }
  }

  private isValidDate(date: string): boolean {
    return !isNaN(Date.parse(date));
  }

  public static create(date: string): FlightDate {
    return new FlightDate({value: date});
  }

  public toString(): string {
    return this.props.value;
  }
}
```
- Location.ts
```typescript

import {BaseValueObject} from'../../shared/BaseValueObject';

interface LocationProps {
  location: string;
  time: string;
}

export class Location extends BaseValueObject<LocationProps> {
  private constructor(props: LocationProps) {
    super(props);
  }

  get location(): string {
    return this.props.location;
  }

  get time(): string {
    return this.props.time;
  }

  protected validate(props: LocationProps): void {
    if (props.location.trim() === '') {
      throw new Error('Location cannot be empty');
    }
    if (props.time.trim() === '') {
      throw new Error('Time cannot be empty');
    }
  }

  public static create(location: string, time: string): Location {
    return new Location({location, time});
  }
}
```
- FlightDuration.ts
```typescript

import {BaseValueObject}from'../../shared/BaseValueObject';

interface FlightDurationProps {
  value: number; // Duration in minutes
}

export class FlightDuration extends BaseValueObject<FlightDurationProps> {
  private constructor(props: FlightDurationProps) {
    super(props);
    this.validate(props);
  }

  protected validate(props: FlightDurationProps): void {
    if (props.value <= 0) {
      throw new Error('Flight duration must be positive');
    }
  }

  public static create(duration: number): FlightDuration {
    return new FlightDuration({value: duration});
  }

  public toString(): string {
    return `${this.props.value} minutes`;
  }
}
```

4. CSVファイルの読み込みとバリデーション
- flightLogUtils.ts
```typescript
import RNFS from 'react-native-fs';
import {FlightLog}from'../domain/flightlog/FlightLog';
import {FlightDate}from'../domain/shared/valueObjects/FlightDate';
import {Location}from'../domain/flightlog/valueObjects/Location';
import {FlightDuration}from'../domain/flightlog/valueObjects/FlightDuration';

export const getFilesWithExtension = async (
  extension: string,
): Promise<string[]> => {
  const directoryPath = `${RNFS.DownloadDirectoryPath}/flightReport`;
  const files = await RNFS.readDir(directoryPath);
  return files
    .filter(file => file.name.endsWith(extension))
    .map(file => file.path);
};

export const validateCSVFormat = (csvContent: string): boolean => {
  if (!csvContent || csvContent.trim() === '') {
    return false;
  }
  const expectedHeaders = [
    'key',
    'date',
    'pilotName',
    'registrationNumber',
    'flightPurposeAndRoute',
    'takeoffLocationAndTime',
    'landingLocationAndTime',
    'flightDuration',
    'issues',
  ];
  const rows = csvContent.split('\n').filter(Boolean);
  const headers = rows[0].split(',');
  console.log('validateCSVFormat: CSV Headers:', headers);
  console.log('Expected Headers:', expectedHeaders);
  return expectedHeaders.every((header, index) => header === headers[index]);
};

export const loadCSVFlightLogsFromFile = async (
  filePath: string,
): Promise<FlightLog[]> => {
  const csv = await RNFS.readFile(filePath);
  if (!csv || csv.trim() === '') {
    return [];
  }
  console.log(`CSV Content from ${filePath}: ${csv}`);
  const rows = csv.split('\n').filter(Boolean);
  const headers = rows[0].split(',');
  console.log(`CSV Headers: ${headers}`);

  const flightLogs: FlightLog[] = rows.slice(1).map((row, index) => {
    const [
      key,
      date,
      pilotName,
      registrationNumber,
      flightPurposeAndRoute,
      takeoffLocationAndTime,
      landingLocationAndTime,
      flightDuration,
      issues,
    ] = row.split(',');

    console.log(`Row ${index + 1}: Date value: ${date}`);

    const [takeoffLocation, takeoffTime] = takeoffLocationAndTime.split(' ');
    const [landingLocation, landingTime] = landingLocationAndTime.split(' ');

    let parsedDate;
    try {
      parsedDate = FlightDate.create(date);
    } catch (error) {
      console.error(`Error parsing date: ${date}, Error: ${error.message}`);
      throw error;
    }

    return new FlightLog(
      key,
      parsedDate,
      pilotName,
      registrationNumber,
      flightPurposeAndRoute,
      Location.create(takeoffLocation, takeoffTime),
      Location.create(landingLocation, landingTime),
      FlightDuration.create(parseInt(flightDuration)),
      issues || '',
    );
  });
  return flightLogs;
};

```

4. CSVファイルの読み込みとバリデーション
- CSVファイルの読み込みとバリデーションは、アプリの動作において重要なステップです。CSVファイルの形式やデータの整合性を確認するために、以下の手順で進めました。

-- validateCSVFormat関数の実装
- validateCSVFormat関数は、CSVファイルのヘッダーが期待される形式と一致するかを確認します。この関数により、ファイルのフォーマットが正しいことを確認できます。

```typescript

export const validateCSVFormat = (csvContent: string): boolean => {
  if (!csvContent || csvContent.trim() === '') {
    return false;
  }
  const expectedHeaders = [
    'key',
    'date',
    'pilotName',
    'registrationNumber',
    'flightPurposeAndRoute',
    'takeoffLocationAndTime',
    'landingLocationAndTime',
    'flightDuration',
    'issues',
  ];
  const rows = csvContent.split('\n').filter(Boolean);
  const headers = rows[0].split(',');
  console.log('validateCSVFormat: CSV Headers:', headers);
  console.log('Expected Headers:', expectedHeaders);
  return expectedHeaders.every((header, index) => header === headers[index]);
};
```

-- loadCSVFlightLogsFromFile関数の実装
- loadCSVFlightLogsFromFile関数は、CSVファイルを読み込み、各行をパースしてFlightLogオブジェクトの配列を作成します。この関数では、各フィールドの形式を確認し、必要に応じて変換を行います。

```typescript

export const loadCSVFlightLogsFromFile = async (
  filePath: string,
): Promise<FlightLog[]> => {
  const csv = await RNFS.readFile(filePath);
  if (!csv || csv.trim() === '') {
    return [];
  }
  console.log(`CSV Content from ${filePath}: ${csv}`);
  const rows = csv.split('\n').filter(Boolean);
  const headers = rows[0].split(',');
  console.log(`CSV Headers: ${headers}`);

  const flightLogs: FlightLog[] = rows.slice(1).map((row, index) => {
    const [
      key,
      date,
      pilotName,
      registrationNumber,
      flightPurposeAndRoute,
      takeoffLocationAndTime,
      landingLocationAndTime,
      flightDuration,
      issues,
    ] = row.split(',');

    console.log(`Row ${index + 1}: Date value: ${date}`);

    const [takeoffLocation, takeoffTime] = takeoffLocationAndTime.split(' ');
    const [landingLocation, landingTime] = landingLocationAndTime.split(' ');

    let parsedDate;
    try {
      parsedDate = FlightDate.create(date);
    } catch (error) {
      console.error(`Error parsing date: ${date}, Error: ${error.message}`);
      throw error;
    }

    return new FlightLog(
      key,
      parsedDate,
      pilotName,
      registrationNumber,
      flightPurposeAndRoute,
      Location.create(takeoffLocation, takeoffTime),
      Location.create(landingLocation, landingTime),
      FlightDuration.create(parseInt(flightDuration)),
      issues || '',
    );
  });
  return flightLogs;
};
```

5. ディテールスクリーンの実装
- 詳細画面では、選択したフライトログの情報を表示します。各フィールドを表示する際に、toStringメソッドを使用してオブジェクトの値を文字列に変換します。

```typescript

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { FlightLog } from '../../domain/flightlog/FlightLog';
import Header from '../../components/Header';
import { RootStackParamList } from '../../navigation/ParamList';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { record } = route.params;

  return (
    <View style={styles.container}>
      <Header title="Detail Screen" />
      <View style={styles.content}>
        <Text style={styles.label}>Key:</Text>
        <Text style={styles.value}>{record.key}</Text>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{record.date.toString()}</Text>
        <Text style={styles.label}>Pilot Name:</Text>
        <Text style={styles.value}>{record.pilotName}</Text>
        <Text style={styles.label}>Registration Number:</Text>
        <Text style={styles.value}>{record.registrationNumber}</Text>
        <Text style={styles.label}>Flight Purpose and Route:</Text>
        <Text style={styles.value}>{record.flightPurposeAndRoute}</Text>
        <Text style={styles.label}>Takeoff Location and Time:</Text>
        <Text style={styles.value}>{record.takeoffLocationAndTime.toString()}</Text>
        <Text style={styles.label}>Landing Location and Time:</Text>
        <Text style={styles.value}>{record.landingLocationAndTime.toString()}</Text>
        <Text style={styles.label}>Flight Duration:</Text>
        <Text style={styles.value}>{record.flightDuration.toString()}</Text>
        <Text style={styles.label}>Issues:</Text>
        <Text style={styles.value}>{record.issues}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default DetailScreen;
```