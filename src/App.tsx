import 'react-native-gesture-handler';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { loadSettings } from './infrastructure/repositories/SettingsManager';

type Settings = {
  priority: string;
} | null;

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(null);

  useEffect(() => {
    const requestStoragePermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'This app needs access to your storage to save flight logs.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the storage');
          } else {
            console.log('Storage permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    const loadAppSettings = async () => {
      const loadedSettings = await loadSettings();
      setSettings(loadedSettings);
      console.log('Loaded settings:', loadedSettings);
    };

    requestStoragePermission();
    loadAppSettings();
  }, []);

  return <AppNavigator />;
};

export default App;

