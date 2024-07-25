import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlightLog } from '../../domain/models/FlightLog';
import { createFlightLogRepository } from '../../infrastructure/repositories/FlightLogRepositoryFactory';
import { IDataStore } from '../../domain/repositories/IDataStore';
import FlightLogList from '../../components/FlightLogList';
import Header from '../../components/Header';

type RootStackParamList = {
  Home: undefined;
  Detail: { record: FlightLog };
  AddRecord: undefined;
  Export: undefined;
  NewFlightLog: undefined;
};

const extractFileName = (filePath: string): string => {
  return filePath.split('/').pop() || filePath;
};

function FlightRecordsScreen() {
  const [records, setRecords] = useState<FlightLog[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [repository, setRepository] = useState<IDataStore<FlightLog> | null>(null);

  useEffect(() => {
    const initRepository = async () => {
      const repo = await createFlightLogRepository();
      setRepository(repo);
    };

    initRepository();
  }, []);

  useEffect(() => {
    const listAndSelectFiles = async () => {
      if (repository) {
        try {
          const files = await repository.listFiles();
          if (files.length === 0) {
            // No files found, navigate to new flight log screen
            navigation.navigate('NewFlightLog');
          } else if (files.length === 1) {
            // Only one file found, load it directly
            const data = await repository.load(files[0]);
            setRecords(data);
          } else {
            // Multiple files found, show selection popup
            Alert.alert(
              'ファイル選択',
              '読み込むファイルを選択してください。',
              [
                ...files.map((file: string) => ({
                  text: extractFileName(file),
                  onPress: async () => {
                    try {
                      const data = await repository.load(file);
                      setRecords(data);
                    } catch (e) {
                      console.error(e);
                    }
                  },
                })),
                {
                  text: '新規作成',
                  onPress: () => {
                    navigation.navigate('NewFlightLog');
                  },
                  style: 'default',
                },
                {
                  text: 'キャンセル',
                  style: 'cancel'
                }
              ],
              { cancelable: true }
            );
          }
        } catch (error) {
          console.error('Error loading logs:', error);
        }
      }
    };

    listAndSelectFiles();
  }, [repository]);

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

export default FlightRecordsScreen;
