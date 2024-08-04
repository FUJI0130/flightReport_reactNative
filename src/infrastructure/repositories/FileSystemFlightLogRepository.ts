// src/infrastructure/repositories/FileSystemFlightLogRepository.ts
import RNFS from 'react-native-fs';
import {FlightLog} from '../../domain/flightlog/FlightLog';
import {FlightLogRepository} from '../../domain/repositories/FlightLogRepository';
import {
  getFilesWithExtension,
  loadCSVFlightLogsFromFile,
  loadJSONFlightLogsFromFile,
} from '../../utils/flightLogUtils';

const directoryPath = `${RNFS.DownloadDirectoryPath}/flightReport`;
const logsPath = `${directoryPath}/flight_logs.json`;
const exportPath = `${directoryPath}/flight_logs.csv`;
const settingsPath = `${directoryPath}/settings.json`;

const ensureSettingsFileExists = async () => {
  const exists = await RNFS.exists(settingsPath);
  if (!exists) {
    await RNFS.writeFile(settingsPath, JSON.stringify({}));
  }
};

export const loadSettings = async (): Promise<any> => {
  await ensureSettingsFileExists();
  const contents = await RNFS.readFile(settingsPath);
  return JSON.parse(contents);
};

const ensureDirectoryExists = async () => {
  const exists = await RNFS.exists(directoryPath);
  if (!exists) {
    await RNFS.mkdir(directoryPath);
  }
};

export class FileSystemFlightLogRepository implements FlightLogRepository {
  async listFiles(): Promise<string[]> {
    await ensureDirectoryExists();
    const settings = await loadSettings();
    const priority = settings.priority || 'csv'; // デフォルトはCSV優先

    if (priority === 'csv') {
      return await getFilesWithExtension('.csv');
    } else if (priority === 'json') {
      return await getFilesWithExtension('.json');
    } else {
      throw new Error(
        `設定ファイルのpriorityに対応外のファイル形式が指定されています: ${priority}. 'csv' または 'json' のいずれかを指定してください。`,
      );
    }
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

    if (fileName.endsWith('.csv')) {
      return await loadCSVFlightLogsFromFile(filePath);
    } else if (fileName.endsWith('.json')) {
      return await loadJSONFlightLogsFromFile(filePath);
    } else {
      throw new Error('Unsupported file format');
    }
  }

  async save(flightLog: FlightLog, fileName?: string): Promise<void> {
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

    const newCSVData = this.jsonToCSV([flightLog]);
    csvData += csvData ? `\n${newCSVData}` : newCSVData;

    await RNFS.writeFile(filePath, csvData, 'utf8');
  }

  async export(): Promise<void> {
    const flightLogs = await this.load('');
    if (flightLogs.length === 0) {
      throw new Error('No flight logs available to export');
    }
    const csv = this.jsonToCSV(flightLogs);
    await RNFS.writeFile(exportPath, csv);
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

  // 追加: CSVファイルを読み込むメソッド
  public async loadCSVFlightLogsFromFile(
    filePath: string,
  ): Promise<FlightLog[]> {
    return loadCSVFlightLogsFromFile(filePath);
  }

  // 追加: JSONファイルを読み込むメソッド
  public async loadJSONFlightLogsFromFile(
    filePath: string,
  ): Promise<FlightLog[]> {
    return loadJSONFlightLogsFromFile(filePath);
  }
}
