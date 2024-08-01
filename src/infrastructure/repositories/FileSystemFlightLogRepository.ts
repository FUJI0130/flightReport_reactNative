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
  async loadFlightLogs(): Promise<FlightLog[]> {
    await ensureDirectoryExists();
    const settings = await loadSettings();
    const priority = settings.priority || 'csv'; // デフォルトはCSV優先

    if (priority === 'csv') {
      const csvFiles = await getFilesWithExtension('.csv');
      if (csvFiles.length === 1) {
        return await loadCSVFlightLogsFromFile(csvFiles[0]);
      } else if (csvFiles.length > 1) {
        // 複数のCSVファイルが存在する場合に選択を要求
        throw new Error(
          `複数のCSVファイルが見つかりました: ${csvFiles.join(', ')}`,
        );
      }
    } else if (priority === 'json') {
      const jsonFiles = await getFilesWithExtension('.json');
      if (jsonFiles.length === 1) {
        return await loadJSONFlightLogsFromFile(jsonFiles[0]);
      } else if (jsonFiles.length > 1) {
        // 複数のJSONファイルが存在する場合に選択を要求
        throw new Error(
          `複数のJSONファイルが見つかりました: ${jsonFiles.join(', ')}`,
        );
      }
    } else {
      throw new Error(
        `設定ファイルのpriorityに対応外のファイル形式が指定されています: ${priority}. 'csv' または 'json' のいずれかを指定してください。`,
      );
    }

    // CSVもJSONも存在しない場合は空の配列を返す
    return [];
  }

  async saveFlightLog(newLog: FlightLog): Promise<void> {
    await ensureDirectoryExists();
    const contents = await RNFS.readFile(logsPath);
    const flightLogs = JSON.parse(contents);
    flightLogs.push(newLog);
    await RNFS.writeFile(logsPath, JSON.stringify(flightLogs));
  }

  async exportFlightLogsToCSV(): Promise<void> {
    const flightLogs = await this.loadFlightLogs();
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
