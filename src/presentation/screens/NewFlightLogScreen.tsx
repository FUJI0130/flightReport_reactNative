// src/presentation/screens/NewFlightLogScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import Header from '../../components/Header';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/ParamList';

const NewFlightLogScreen: React.FC = () => {
  const [details, setDetails] = useState('');
  const [pilotName, setPilotName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [flightPurposeAndRoute, setFlightPurposeAndRoute] = useState('');
  const [takeoffLocation, setTakeoffLocation] = useState('');
  const [landingLocation, setLandingLocation] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleNext = () => {
    if (!pilotName || !registrationNumber || !flightPurposeAndRoute || !takeoffLocation || !landingLocation) {
      Alert.alert('エラー', 'すべてのフィールドを入力してください');
      return;
    }

    const flightDetails = {
      pilotName,
      registrationNumber,
      flightPurposeAndRoute,
      takeoffLocation,
      landingLocation,
    };

    navigation.navigate('FlightTimer', { flightDetails });
  };

  return (
    <View style={styles.container}>
      <Header title="New Flight Log" />
      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Pilot Name"
          value={pilotName}
          onChangeText={setPilotName}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Takeoff Location"
          value={takeoffLocation}
          onChangeText={setTakeoffLocation}
        />
        <TextInput
          style={styles.input}
          placeholder="Landing Location"
          value={landingLocation}
          onChangeText={setLandingLocation}
        />
        <Button title="Next" onPress={handleNext} />
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
