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

    const csvHeader = 'key,date,pilotName,registrationNumber,flightPurposeAndRoute,takeoffLocationAndTime,landingLocationAndTime,flightDuration,issues\n';
    const csvRow = newLog.toCSVRow();
    const csvContent = csvHeader + csvRow;

    try {
      await RNFS.writeFile(filePath, csvContent, 'utf8');
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
