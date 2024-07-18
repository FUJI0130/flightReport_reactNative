import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'flightLogs';

type FlightLog = {
  key: string;
  details: string;
};

export const storeData = async (details: string) => {
  try {
    const existingLogs = await loadFlightLogs();
    const newLog = {key: Date.now().toString(), details};
    const newLogs = [...existingLogs, newLog];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
  } catch (e) {
    console.error('Error storing data:', e);
  }
};

export const loadFlightLogs = async (): Promise<FlightLog[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading flight logs:', e);
    return [];
  }
};

export default {
  storeData,
  loadFlightLogs,
};
