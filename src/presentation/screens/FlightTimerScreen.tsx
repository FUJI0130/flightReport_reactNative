import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/ParamList';
import Header from '../../components/Header';
import { StackNavigationProp } from '@react-navigation/stack';

type FlightTimerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FlightTimer'>;
type FlightTimerScreenRouteProp = RouteProp<RootStackParamList, 'FlightTimer'>;

const FlightTimerScreen: React.FC = () => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [issues, setIssues] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [inputIssues, setInputIssues] = useState<string>('');
  const navigation = useNavigation<FlightTimerScreenNavigationProp>();
  const route = useRoute<FlightTimerScreenRouteProp>();
  const { flightDetails } = route.params;

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const formatTime = (milliseconds: number) => {
    const hrs = Math.floor(milliseconds / 3600000);
    const mins = Math.floor((milliseconds % 3600000) / 60000);
    const secs = Math.floor((milliseconds % 60000) / 1000);
    const millis = Math.floor((milliseconds % 1000) / 10);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(millis).padStart(2, '0')}`;
  };

  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    setTimer(0);
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 10); // ミリ秒単位の増加
    }, 10);
    setTimerInterval(interval);
  };

  const handleEnd = () => {
    const now = new Date();
    setEndTime(now);
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    const flightDuration = (endTime!.getTime() - startTime!.getTime()) / 60000; // ミリ秒から分に変換
    const flightLog = {
      ...flightDetails,
      startTime: startTime?.toISOString(),
      endTime: endTime?.toISOString(),
      flightDuration,
      issues: inputIssues,
    };

    // ここに飛行日誌を保存するロジックを追加

    setModalVisible(false);
    Alert.alert('保存しました', 'フライトログが保存されました。', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Home'),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Flight Timer" />
      <View style={styles.content}>
        <Text>Pilot Name: {flightDetails.pilotName}</Text>
        <Text>Registration Number: {flightDetails.registrationNumber}</Text>
        <Text>Flight Purpose and Route: {flightDetails.flightPurposeAndRoute}</Text>
        <Text>Takeoff Location: {flightDetails.takeoffLocation}</Text>
        <Text>Landing Location: {flightDetails.landingLocation}</Text>
        <Text style={styles.timer}>{formatTime(timer)}</Text>
        <Button title="Start" onPress={handleStart} />
        <Button title="End" onPress={handleEnd} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>不具合がありましたか？</Text>
            <TextInput
              style={styles.input}
              placeholder="不具合の詳細を入力"
              value={inputIssues}
              onChangeText={setInputIssues}
            />
            <Button title="キャンセル" onPress={() => setModalVisible(false)} />
            <Button title="保存" onPress={handleSave} />
          </View>
        </View>
      </Modal>
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
  timer: {
    fontSize: 48,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
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

export default FlightTimerScreen;
