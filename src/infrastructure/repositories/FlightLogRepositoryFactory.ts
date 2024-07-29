import {CSVFlightLogRepository} from './CSVFlightLogRepository';
import {JSONFlightLogRepository} from './JSONFlightLogRepository';
import {IDataStore} from '../../domain/repositories/IDataStore';
import {FlightLog} from '../../domain/flightlog/FlightLog';
import RNFS from 'react-native-fs';

const settingsPath = `${RNFS.DownloadDirectoryPath}/flightReport/settings.json`;

export const loadSettings = async (): Promise<{priority: string}> => {
  const exists = await RNFS.exists(settingsPath);
  if (exists) {
    const contents = await RNFS.readFile(settingsPath);
    return JSON.parse(contents);
  }
  return {priority: 'csv'}; // デフォルトはcsv
};

export const createFlightLogRepository = async (): Promise<
  IDataStore<FlightLog>
> => {
  const settings = await loadSettings();
  if (settings.priority === 'json') {
    return new JSONFlightLogRepository();
  }
  return new CSVFlightLogRepository();
};
