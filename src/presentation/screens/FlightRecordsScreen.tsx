// src/presentation/screens/FlightRecordsScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { FlightLog } from '../../domain/flightlog/FlightLog';
import { createFlightLogRepository } from '../../infrastructure/repositories/FlightLogRepositoryFactory';
import { IDataStore } from '../../domain/repositories/IDataStore';
import Header from '../../components/Header';
import RNFS from 'react-native-fs';
import { validateCSVFormat } from '../../utils/flightLogUtils';
import { RootStackParamList } from '../../navigation/ParamList';
import FileSelectionDialog from '../../components/FileSelectionDialog';

const extractFileName = (filePath: string): string => {
  return filePath.split('/').pop() || filePath;
};

function FlightRecordsScreen() {
  const [records, setRecords] = useState<FlightLog[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [repository, setRepository] = useState<IDataStore<FlightLog> | null>(null);
  const [fileSelectionVisible, setFileSelectionVisible] = useState(false);
  const [validFiles, setValidFiles] = useState<string[]>([]);
  const route = useRoute<RouteProp<RootStackParamList, 'FlightRecords'>>();

const loadLogs = async (fileName: string) => {
    if (repository) {
      try {
        const filePath = fileName.includes(RNFS.DownloadDirectoryPath) ? fileName : `${RNFS.DownloadDirectoryPath}/flightReport/${fileName}`;
        console.log(`Loading logs from: ${filePath}`);
        const data = await repository.load(filePath);
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
        console.error(`Load logs error: ${error} FileName: ${fileName}`);
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
          console.log('Checking file:', file);
          if (validateCSVFormat(csvContent)) {
            validFiles.push(file);
          }
        }

        setValidFiles(validFiles);
        setFileSelectionVisible(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const initRepository = async () => {
      const repo = await createFlightLogRepository();
      setRepository(repo);
    };

    initRepository();
  }, []);

useEffect(() => {
  if (route.params?.newFileName) {
    const filePath = `${RNFS.DownloadDirectoryPath}/flightReport/${route.params.newFileName}`;
    loadLogs(filePath);
  } else {
    showFileSelectionPopup();
  }
}, [repository, route.params?.newFileName]);


  const handleFileSelect = (fileName: string) => {
    setFileSelectionVisible(false);
    loadLogs(fileName);
  };

  const handleNewFile = () => {
    setFileSelectionVisible(false);
    navigation.navigate('NewFlightLog');
  };

  const handleLogPress = (record: FlightLog) => {
    navigation.navigate('Detail', { record });
  };

  const renderItem = ({ item }: { item: FlightLog }) => (
    <TouchableOpacity onPress={() => handleLogPress(item)}>
      <View style={styles.item}>
        <Text>日付: {item.date.toString()}</Text>
        <Text>飛行時間: {item.flightDuration.toString()}</Text>
        <Text>操縦者名: {item.pilotName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Flight Records" />
      <FlatList
        data={records}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No records found</Text>}
      />
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
      <FileSelectionDialog
        visible={fileSelectionVisible}
        files={validFiles.map(extractFileName)}
        onSelect={handleFileSelect}
        onCreateNew={handleNewFile}
        onCancel={() => setFileSelectionVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default FlightRecordsScreen;
