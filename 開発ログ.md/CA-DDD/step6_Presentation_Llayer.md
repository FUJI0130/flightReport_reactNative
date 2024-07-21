# Step6_Presentation_Layer.md

## 画面コンポーネントのリファクタリング

既存の画面コンポーネントをClean Architecture + DDDに合わせてリファクタリングします。プレゼンテーション層として、以下のスクリーンコンポーネントを修正します。

### AddRecordScreen.tsx

```typescript
// src/presentation/screens/AddRecordScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AddFlightRecordUseCase } from '../../application/usecases/AddFlightRecordUseCase';
import { FileSystemFlightLogRepository } from '../../infrastructure/repositories/FileSystemFlightLogRepository';

const AddRecordScreen: React.FC = () => {
  const [details, setDetails] = useState('');
  const navigation = useNavigation();
  const repository = new FileSystemFlightLogRepository();
  const addFlightRecordUseCase = new AddFlightRecordUseCase(repository);

  const handleSave = async () => {
    await addFlightRecordUseCase.execute({ key: new Date().toISOString(), details });
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

### DetailScreen.tsx

```typescript
// src/presentation/screens/DetailScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { FlightLog } from '../../domain/models/FlightLog';

type RootStackParamList = {
  Home: undefined;
  Detail: { record: FlightLog };
  AddRecord: undefined;
};

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { record } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Detail Screen</Text>
      <Text>Key: {record.key}</Text>
      <Text>Details: {record.details}</Text>
    </View>
  );
};

export default DetailScreen;
```
### ExportScreen.tsx

```typescript

// src/presentation/screens/ExportScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ExportFlightLogsUseCase } from '../../application/usecases/ExportFlightLogsUseCase';
import { FileSystemFlightLogRepository } from '../../infrastructure/repositories/FileSystemFlightLogRepository';

const ExportScreen: React.FC = () => {
  const navigation = useNavigation();
  const repository = new FileSystemFlightLogRepository();
  const exportFlightLogsUseCase = new ExportFlightLogsUseCase(repository);

  const handleExport = async () => {
    try {
      await exportFlightLogsUseCase.execute();
      console.log('Exported flight logs to CSV');
      navigation.goBack();
    } catch (e) {
      console.error('Error exporting flight logs:', e);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Export Flight Logs</Text>
      <Button title="Export to CSV" onPress={handleExport} />
    </View>
  );
};

export default ExportScreen;
```

### 新しいコンポーネントの作成
プレゼンテーション層の一部として、必要な新しいコンポーネントを作成します。

### FlightLogItem.tsx

```typescript

// src/presentation/components/FlightLogItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FlightLog } from '../../domain/models/FlightLog';

interface Props {
  record: FlightLog;
  onPress: () => void;
}

const FlightLogItem: React.FC<Props> = ({ record, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <Text>{record.details}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FlightLogItem;
```

### FlightLogList.tsx

```typescript

// src/presentation/components/FlightLogList.tsx
import React from 'react';
import { View, FlatList } from 'react-native';
import { FlightLog } from '../../domain/models/FlightLog';
import FlightLogItem from './FlightLogItem';

interface Props {
  records: FlightLog[];
  onPressItem: (record: FlightLog) => void;
}

const FlightLogList: React.FC<Props> = ({ records, onPressItem }) => {
  const renderItem = ({ item }: { item: FlightLog }) => (
    <FlightLogItem record={item} onPress={() => onPressItem(item)} />
  );

  return (
    <FlatList
      data={records}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
    />
  );
};

export default FlightLogList;
```

### Header.tsx

```typescript

// src/presentation/components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Flight Report</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 60,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;
```

これらのコンポーネントを利用して、プレゼンテーション層を完成させます。

