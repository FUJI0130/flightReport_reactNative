import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Error storing data:', e);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.error('Error fetching data:', e);
  }
  return null;
};

export const loadFlightLogs = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);
    return result.map(([key, value]) => ({key, details: value}));
  } catch (e) {
    console.error('Error loading flight logs:', e);
    return [];
  }
};

export default {
  storeData,
  getData,
  loadFlightLogs,
};
