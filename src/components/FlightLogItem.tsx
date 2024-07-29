// src/components/FlightLogItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlightLog } from '../domain/flightlog/FlightLog';

type FlightLogItemProps = {
  log: FlightLog;
  onPress: () => void;
};

const FlightLogItem: React.FC<FlightLogItemProps> = ({ log, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.container}>
      <Text>日付: {log.date.value}</Text>
      <Text>飛行時間: {log.flightDuration}</Text>
      <Text>操縦者名: {log.pilotName}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default FlightLogItem;
