import React from 'react';
import { View, Text, Button } from 'react-native';
import Storage from '../../infrastructure/repositories/Storage';
import { useNavigation } from '@react-navigation/native';

const ExportScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleExport = async () => {
    try {
      await Storage.exportFlightLogsToCSV();
      console.log('Exported flight logs to CSV');
      navigation.goBack();
    } catch (e) {
      console.error('Error exporting flight logs:', e);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Export Flight Logs</Text>
      <Button title="Export to CSV" onPress={handleExport} />
    </View>
  );
};

export default ExportScreen;
