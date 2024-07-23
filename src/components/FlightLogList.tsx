import React from 'react';
import { View, StyleSheet } from 'react-native';
import FlightLogItem from './FlightLogItem';
import { FlightLog } from './../domain/models/FlightLog';

interface FlightLogListProps {
  logs: FlightLog[];
  onLogPress: (log: FlightLog) => void;
}

const FlightLogList: React.FC<FlightLogListProps> = ({ logs, onLogPress }) => {
  return (
    <View style={styles.container}>
      {logs.map((log) => (
        <FlightLogItem key={log.key} log={log} onPress={() => onLogPress(log)} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default FlightLogList;
