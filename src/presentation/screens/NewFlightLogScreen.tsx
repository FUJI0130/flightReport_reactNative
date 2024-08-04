import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import Header from '../../components/Header';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AddFlightRecordUseCase } from '../../application/usecases/AddFlightRecordUseCase';
import { RootStackParamList } from '../../navigation/ParamList';
import { Picker } from '@react-native-picker/picker';
import { loadPilots, loadLocations } from '../../utils/flightLogUtils';

const NewFlightLogScreen: React.FC = () => {
  const [details, setDetails] = useState('');
  const [fileName, setFileName] = useState('');
  const [pilotName, setPilotName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [flightPurposeAndRoute, setFlightPurposeAndRoute] = useState('');
  const [takeoffLocation, setTakeoffLocation] = useState('');
  const [takeoffTime, setTakeoffTime] = useState('');
  const [landingLocation, setLandingLocation] = useState('');
  const [landingTime, setLandingTime] = useState('');
  const [flightDuration, setFlightDuration] = useState('');
  const [issues, setIssues] = useState('');
  const [pilots, setPilots] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadData = async () => {
      const loadedPilots = await loadPilots();
      setPilots(loadedPilots);
      const loadedLocations = await loadLocations();
      setLocations(loadedLocations);
    };

    loadData();
  }, []);

  const handleSave = async () => {
    const addFlightRecordUseCase = new AddFlightRecordUseCase();

    const details = {
      date: new Date().toISOString(),
      pilotName,
      registrationNumber,
      flightPurposeAndRoute,
      takeoffLocation,
      takeoffTime,
      landingLocation,
      landingTime,
      flightDuration: parseInt(flightDuration, 10),
      issues,
    };

    try {
      await addFlightRecordUseCase.execute(details);
      const finalFileName = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
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

  const handleStart = () => {
    setTakeoffTime(new Date().toISOString());
  };

  const handleEnd = () => {
    const endTime = new Date();
    const startTime = new Date(takeoffTime);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 6000); // 分単位での計算
    setFlightDuration(duration.toString());
    setLandingTime(endTime.toISOString());
  };

  return (
    <View style={styles.container}>
      <Header title="New Flight Log" />
      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="File Name"
          value={fileName}
          onChangeText={setFileName}
        />
        <Picker
          selectedValue={pilotName}
          onValueChange={(itemValue) => setPilotName(itemValue)}
          style={styles.input}
        >
          {pilots.map((pilot) => (
            <Picker.Item
              key={pilot}
              label={pilot}
              value={pilot}
            />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Registration Number"
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Flight Purpose and Route"
          value={flightPurposeAndRoute}
          onChangeText={setFlightPurposeAndRoute}
        />
        <Picker
          selectedValue={takeoffLocation}
          onValueChange={(itemValue) => setTakeoffLocation(itemValue)}
          style={styles.input}
        >
          {locations.map((location) => (
            <Picker.Item
              key={location}
              label={location}
              value={location}
            />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Landing Location"
          value={landingLocation}
          onChangeText={setLandingLocation}
        />
        <Button title="Start Flight" onPress={handleStart} />
        <Button title="End Flight" onPress={handleEnd} />
        <TextInput
          style={styles.input}
          placeholder="Flight Duration (minutes)"
          value={flightDuration}
          onChangeText={setFlightDuration}
          keyboardType="numeric"
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Issues"
          value={issues}
          onChangeText={setIssues}
        />
        <Button title="Save Record" onPress={handleSave} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
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
