// src/infrastructure/repositories/CSVFlightLogRepository.ts
import RNFS from 'react-native-fs';
import {FlightLog} from '../../domain/models/FlightLog';
import {IDataStore} from '../../domain/repositories/IDataStore';
import {
  getFilesWithExtension,
  loadCSVFlightLogsFromFile,
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
    const files = await getFilesWithExtension('.csv');
    console.log('CSV files:', files);
    return files;
  }

  async load(fileName: string): Promise<FlightLog[]> {
    await ensureDirectoryExists();
    const filePath = fileName.includes(RNFS.DownloadDirectoryPath)
      ? fileName
      : `${directoryPath}/${fileName}`;
    console.log(`Loading file: ${filePath}`);
    const exists = await RNFS.exists(filePath);
    if (!exists) {
      throw new Error(`File does not exist: ${filePath}`);
    }
    return await loadCSVFlightLogsFromFile(filePath);
  }

  async save(item: FlightLog, fileName?: string): Promise<void> {
    await ensureDirectoryExists();
    const finalFileName = fileName?.endsWith('.csv')
      ? fileName
      : `${fileName}.csv`;
    const filePath = `${directoryPath}/${finalFileName}`;
    let csvData = '';

    const exists = await RNFS.exists(filePath);
    if (exists) {
      csvData = await RNFS.readFile(filePath);
      csvData = csvData.trim();
    }

    const newCSVData = this.jsonToCSV([item]);
    csvData += csvData ? `\n${newCSVData}` : newCSVData;

    await RNFS.writeFile(filePath, csvData, 'utf8');
  }

  async export(): Promise<void> {
    const flightLogs = await this.load('');
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
