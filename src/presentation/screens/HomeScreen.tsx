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
