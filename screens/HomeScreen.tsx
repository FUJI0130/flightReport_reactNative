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
  Detail: undefined;
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
        <Text key={index}>{record.details}</Text>
      ))}
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Detail')}
      />
      <Button
        title="Add New Record"
        onPress={() => navigation.navigate('AddRecord')}
      />
    </View>
  );
}

export default HomeScreen;

