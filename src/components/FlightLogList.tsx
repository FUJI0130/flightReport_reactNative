// src/components/FlightLogList.tsx
import React from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FlightLog } from '../domain/flightlog/FlightLog';

interface FlightLogListProps {
  logs: FlightLog[];
  onLogPress: (log: FlightLog) => void;
}

const FlightLogList: React.FC<FlightLogListProps> = ({ logs, onLogPress }) => {
  const renderItem = ({ item }: { item: FlightLog }) => (
    <TouchableOpacity style={styles.item} onPress={() => onLogPress(item)}>
      <Text>日付: {item.date.toString()}</Text>
      <Text>飛行時間: {item.flightDuration.toString()}</Text>
      <Text>操縦者名: {item.pilotName}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={logs}
      renderItem={renderItem}
      keyExtractor={item => item.key}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default FlightLogList;
