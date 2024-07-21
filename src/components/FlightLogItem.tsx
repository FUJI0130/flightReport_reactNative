import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlightLog } from '../domain/models/FlightLog';

interface FlightLogItemProps {
  log: FlightLog;
  onPress: () => void;
}

const FlightLogItem: React.FC<FlightLogItemProps> = ({ log, onPress }) => {
  return (
    <View style={styles.container} onTouchEnd={onPress}>
      <Text>{log.details}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default FlightLogItem;
