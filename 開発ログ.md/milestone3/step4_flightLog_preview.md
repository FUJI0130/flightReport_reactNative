# ステップ4: 飛行記録の一覧表示機能

### 目的
- HomeScreenで飛行記録のリストを表示する

### 実装手順

1. `RecordList.tsx`コンポーネントを作成する。
    ```typescript
    // src/components/RecordList.tsx
    import React from 'react';
    import { View, Text, TouchableOpacity } from 'react-native';

    type Record = {
      key: string;
      details: string | null;
    };

    type RecordListProps = {
      records: Record[];
      onPressItem: (record: Record) => void;
    };

    const RecordList: React.FC<RecordListProps> = ({ records, onPressItem }) => {
      return (
        <View>
          {records.map(record => (
            <TouchableOpacity key={record.key} onPress={() => onPressItem(record)}>
              <Text>{record.details}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    };

    export default RecordList;
    ```

2. `HomeScreen.tsx`を修正して、`RecordList`コンポーネントを使用する。
    ```typescript
    // src/screens/HomeScreen.tsx
    import React, { useEffect, useState } from 'react';
    import { View, Text, Button } from 'react-native';
    import { useNavigation, NavigationProp } from '@react-navigation/native';
    import Storage from '../storage/Storage';
    import RecordList from '../components/RecordList';

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
          <RecordList
            records={records}
            onPressItem={(record) => navigation.navigate('Detail', { record })}
          />
          <Button
            title="Add New Record"
            onPress={() => navigation.navigate('AddRecord')}
          />
        </View>
      );
    }

    export default HomeScreen;
    ```

### 変更点
- `RecordList.tsx`コンポーネントを作成して、飛行記録のリストを表示するようにした。
- `HomeScreen.tsx`で`RecordList`コンポーネントを使用して、飛行記録をリスト表示し、各記録をタップすると詳細画面に遷移するようにした。
