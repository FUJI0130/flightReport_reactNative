import React, { useEffect, useState } from 'react';
import { View, Button } from 'react-native';
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

  const handleLogPress = (record: FlightLog) => {
    navigation.navigate('Detail', { record });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Header title="Flight Records" />
      <FlightLogList logs={records} onLogPress={handleLogPress} />
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
