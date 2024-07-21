import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FileSystemFlightLogRepository } from '../../infrastructure/repositories/FileSystemFlightLogRepository';
import Header from '../../components/Header';

const AddRecordScreen: React.FC = () => {
  const [details, setDetails] = useState('');
  const navigation = useNavigation();
  const repository = new FileSystemFlightLogRepository();

  const handleSave = async () => {
    await repository.saveFlightLog({ key: new Date().toISOString(), details });
    console.log('Saved Record:', details);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="Add New Flight Record" />
      <View style={styles.content}>
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

export default AddRecordScreen;
