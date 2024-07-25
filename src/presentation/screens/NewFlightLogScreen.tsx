// src/presentation/screens/NewFlightLogScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { createFlightLogRepository } from '../../infrastructure/repositories/FlightLogRepositoryFactory';

const NewFlightLogScreen: React.FC = () => {
  const [details, setDetails] = useState('');
  const [fileName, setFileName] = useState('');
  const navigation = useNavigation();

  const handleSave = async () => {
    const repository = await createFlightLogRepository();
    const newLog = { key: new Date().toISOString(), details };
    await repository.save(newLog, fileName);

    // 保存したファイルのパスを確認するログ
    console.log('Saved Record:', newLog);

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="New Flight Log" />
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="File Name (optional, .csv or .json)"
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
