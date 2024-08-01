import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/ParamList';
import Header from '../../components/Header';
import { FlightLog } from '../../domain/flightlog/FlightLog';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { record } = route.params as { record: FlightLog };

  return (
    <View style={styles.container}>
      <Header title="Detail Screen" />
      <View style={styles.content}>
        <Text style={styles.label}>Key:</Text>
        <Text style={styles.value}>{record.key}</Text>
        
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{record.date.toString()}</Text>
        
        <Text style={styles.label}>Pilot Name:</Text>
        <Text style={styles.value}>{record.pilotName}</Text>
        
        <Text style={styles.label}>Registration Number:</Text>
        <Text style={styles.value}>{record.registrationNumber}</Text>
        
        <Text style={styles.label}>Flight Purpose and Route:</Text>
        <Text style={styles.value}>{record.flightPurposeAndRoute}</Text>
        
        <Text style={styles.label}>Takeoff Location and Time:</Text>
        <Text style={styles.value}>{record.takeoffLocationAndTime.toString()}</Text>
        
        <Text style={styles.label}>Landing Location and Time:</Text>
        <Text style={styles.value}>{record.landingLocationAndTime.toString()}</Text>
        
        <Text style={styles.label}>Flight Duration:</Text>
        <Text style={styles.value}>{record.flightDuration.toString()}</Text>
        
        <Text style={styles.label}>Issues:</Text>
        <Text style={styles.value}>{record.issues}</Text>
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
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default DetailScreen;
