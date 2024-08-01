// src/infrastructure/repositories/JSONFlightLogRepository.ts

import RNFS from 'react-native-fs';
import {FlightLog} from '../../domain/flightlog/FlightLog';
import {IDataStore} from '../../domain/repositories/IDataStore';
import {
  getFilesWithExtension,
  loadJSONFlightLogsFromFile,
} from '../../utils/flightLogUtils';

const directoryPath = `${RNFS.DownloadDirectoryPath}/flightReport`;

const ensureDirectoryExists = async () => {
  const exists = await RNFS.exists(directoryPath);
  if (!exists) {
    await RNFS.mkdir(directoryPath);
  }
};

export class JSONFlightLogRepository implements IDataStore<FlightLog> {
  async listFiles(): Promise<string[]> {
    await ensureDirectoryExists();
    return await getFilesWithExtension('.json');
  }

  async load(fileName: string): Promise<FlightLog[]> {
    await ensureDirectoryExists();
    const filePath = `${directoryPath}/${fileName}`;
    return await loadJSONFlightLogsFromFile(filePath);
  }

  async save(item: FlightLog, fileName?: string): Promise<void> {
    await ensureDirectoryExists();
    const finalFileName = fileName || `flight_log_${new Date().getTime()}.json`;
    const filePath = `${directoryPath}/${finalFileName}`;
    let jsonData: FlightLog[] = [];
    const exists = await RNFS.exists(filePath);
    if (exists) {
      const fileContents = await RNFS.readFile(filePath);
      jsonData = JSON.parse(fileContents);
    }
    jsonData.push(item);
    await RNFS.writeFile(filePath, JSON.stringify(jsonData), 'utf8');
  }

  async export(): Promise<void> {
    const flightLogs = await this.load('flight_logs.json');
    if (flightLogs.length === 0) {
      throw new Error('No flight logs available to export');
    }
    await RNFS.writeFile(
      `${directoryPath}/flight_logs.json`,
      JSON.stringify(flightLogs),
      'utf8',
    );
  }
}
