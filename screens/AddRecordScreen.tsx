import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import Storage from '../storage/Storage';
import { useNavigation } from '@react-navigation/native';

const AddRecordScreen: React.FC = () => {
  const [details, setDetails] = useState('');
  const navigation = useNavigation();

  const handleSave = async () => {
    await Storage.storeData(details);
    console.log('Saved Record:', details);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text>Add New Flight Record</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '100%', marginBottom: 20, padding: 10 }}
        placeholder="Flight Details"
        value={details}
        onChangeText={setDetails}
      />
      <Button title="Save Record" onPress={handleSave} />
    </View>
  );
};

export default AddRecordScreen;
