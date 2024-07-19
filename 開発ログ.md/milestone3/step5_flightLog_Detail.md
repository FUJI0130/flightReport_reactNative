# ステップ5: 飛行記録の詳細表示機能

### 目的
- DetailScreenで飛行記録の詳細を表示する

### 実装手順

1. `DetailScreen.tsx`を作成する。
    ```typescript
    // src/screens/DetailScreen.tsx
    import React from 'react';
    import { View, Text } from 'react-native';
    import { RouteProp, useRoute } from '@react-navigation/native';

    type Record = {
      key: string;
      details: string | null;
    };

    type RootStackParamList = {
      Home: undefined;
      Detail: { record: Record };
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

2. `HomeScreen.tsx`を修正して、リストアイテムをタップすると`DetailScreen`に遷移するようにする。
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
- `DetailScreen.tsx`を作成して、飛行記録の詳細を表示するようにした。
- `HomeScreen.tsx`でリストアイテムをタップすると`DetailScreen`に遷移するように修正した。
