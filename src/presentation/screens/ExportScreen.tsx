import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FileSystemFlightLogRepository } from '../../infrastructure/repositories/FileSystemFlightLogRepository';
import Header from '../../components/Header';

const ExportScreen: React.FC = () => {
  const navigation = useNavigation();
  const repository = new FileSystemFlightLogRepository();

  const handleExport = async () => {
    try {
      await repository.exportFlightLogsToCSV();
      console.log('Exported flight logs to CSV');
      navigation.goBack();
    } catch (e) {
      console.error('Error exporting flight logs:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Export Flight Logs" />
      <View style={styles.content}>
        <Button title="Export to CSV" onPress={handleExport} />
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
  },
});

export default ExportScreen;
