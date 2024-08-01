// src/presentation/screens/ExportScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createFlightLogRepository } from '../../infrastructure/repositories/FlightLogRepositoryFactory';
import Header from '../../components/Header';

const ExportScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleExport = async () => {
    const repository = await createFlightLogRepository();
    try {
      await repository.export();
      console.log('Exported flight logs');
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
