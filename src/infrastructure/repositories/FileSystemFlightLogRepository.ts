import RNFS from 'react-native-fs';
import {FlightLog} from '../../domain/models/FlightLog';
import {FlightLogRepository} from '../../domain/repositories/FlightLogRepository';

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

const ensureFileExists = async (filePath: string, defaultContent: any) => {
  const exists = await RNFS.exists(filePath);
  if (!exists) {
    await RNFS.writeFile(filePath, JSON.stringify(defaultContent));
  }
};

const loadCSVFlightLogs = async (): Promise<FlightLog[]> => {
  const csv = await RNFS.readFile(exportPath);
  const rows = csv.split('\n');
  const flightLogs: FlightLog[] = rows.slice(1).map(row => {
    const [key, details] = row.split(',');
    return {key, details};
  });
  return flightLogs;
};

const loadJSONFlightLogs = async (): Promise<FlightLog[]> => {
  const contents = await RNFS.readFile(logsPath);
  return JSON.parse(contents);
};

export class FileSystemFlightLogRepository implements FlightLogRepository {
  async loadFlightLogs(): Promise<FlightLog[]> {
    await ensureDirectoryExists();
    const csvExists = await RNFS.exists(exportPath);
    const jsonExists = await RNFS.exists(logsPath);
    const settings = await loadSettings();
    const priority = settings.priority || 'csv'; // デフォルトはCSV優先

    if (priority === 'csv') {
      if (csvExists) {
        return await loadCSVFlightLogs();
      } else if (jsonExists) {
        return await loadJSONFlightLogs();
      }
    } else if (priority === 'json') {
      if (jsonExists) {
        return await loadJSONFlightLogs();
      } else if (csvExists) {
        return await loadCSVFlightLogs();
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
}
