// src/infrastructure/repositories/CSVFlightLogRepository.ts

import RNFS from 'react-native-fs';
import {FlightLog} from '../../domain/models/FlightLog';
import {IDataStore} from '../../domain/repositories/IDataStore';
import {
  getFilesWithExtension,
  loadCSVFlightLogsFromFile,
  validateCSVFormat,
} from '../../utils/flightLogUtils';

const directoryPath = `${RNFS.DownloadDirectoryPath}/flightReport`;

const ensureDirectoryExists = async () => {
  const exists = await RNFS.exists(directoryPath);
  if (!exists) {
    await RNFS.mkdir(directoryPath);
  }
};

export class CSVFlightLogRepository implements IDataStore<FlightLog> {
  async listFiles(): Promise<string[]> {
    await ensureDirectoryExists();
    return await getFilesWithExtension('.csv');
  }

  async load(fileName: string): Promise<FlightLog[]> {
    await ensureDirectoryExists();
    const filePath = `${directoryPath}/${fileName}`;
    const csvContent = await RNFS.readFile(filePath);
    if (!validateCSVFormat(csvContent)) {
      throw new Error('CSVファイルの形式が正しくありません');
    }
    return await loadCSVFlightLogsFromFile(filePath);
  }

  async save(item: FlightLog, fileName?: string): Promise<void> {
    await ensureDirectoryExists();
    const finalFileName = fileName || `flight_log_${new Date().getTime()}.csv`;
    const filePath = `${directoryPath}/${finalFileName}`;
    let csvData = '';
    const exists = await RNFS.exists(filePath);
    if (exists) {
      csvData = await RNFS.readFile(filePath);
    }
    const newCSVData = this.jsonToCSV([item]);
    csvData += `\n${newCSVData}`;
    await RNFS.writeFile(filePath, csvData, 'utf8');
  }

  async export(): Promise<void> {
    const flightLogs = await this.load('flight_logs.csv');
    if (flightLogs.length === 0) {
      throw new Error('No flight logs available to export');
    }
    const csv = this.jsonToCSV(flightLogs);
    await RNFS.writeFile(`${directoryPath}/flight_logs.csv`, csv);
  }

  private jsonToCSV(json: FlightLog[]): string {
    const csvRows: string[] = [];
    const headers = Object.keys(json[0]);
    csvRows.push(headers.join(','));

    for (const row of json) {
      const values = headers.map(header => {
        const escaped = ('' + row[header as keyof FlightLog]).replace(
          /"/g,
          '\\"',
        );
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }
}
