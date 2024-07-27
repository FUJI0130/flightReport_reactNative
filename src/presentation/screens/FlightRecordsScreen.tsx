// src/presentation/screens/FlightRecordsScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlightLog } from '../../domain/models/FlightLog';
import { createFlightLogRepository } from '../../infrastructure/repositories/FlightLogRepositoryFactory';
import { IDataStore } from '../../domain/repositories/IDataStore';
import FlightLogList from '../../components/FlightLogList';
import Header from '../../components/Header';
import RNFS from 'react-native-fs';
import { validateCSVFormat } from '../../utils/flightLogUtils';

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
    const loadLogs = async (fileName: string) => {
      if (repository) {
        try {
          const data = await repository.load(fileName);
          setRecords(data);
        } catch (error) {
          Alert.alert(
            'エラー',
            'CSVファイルの形式が正しくありません',
            [
              {
                text: 'OK',
                onPress: () => showFileSelectionPopup()
              }
            ]
          );
          console.error(error);
        }
      }
    };

    const showFileSelectionPopup = async () => {
      if (repository) {
        try {
          const files = await repository.listFiles();
          const validFiles = [];

          for (const file of files) {
            const csvContent = await RNFS.readFile(file);
            if (validateCSVFormat(csvContent)) {
              validFiles.push(file);
            }
          }

          if (validFiles.length === 0) {
            Alert.alert('No valid files found', '新しいファイルを作成してください。');
            return;
          }

          Alert.alert(
            'ファイル選択',
            '読み込むファイルを選択してください。',
            [
              ...validFiles.map((file: string) => ({
                text: extractFileName(file),
                onPress: () => loadLogs(file),
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
                style: 'cancel',
              },
            ],
            { cancelable: true }
          );
        } catch (error) {
          console.error(error);
        }
      }
    };

    showFileSelectionPopup();
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
