import RNFS from 'react-native-fs';

const directoryPath = `${RNFS.DownloadDirectoryPath}/flightReport`; // Downloadディレクトリに変更
const logsPath = `${directoryPath}/flight_logs.json`;
const exportPath = `${directoryPath}/flight_logs.csv`;

const ensureDirectoryExists = async () => {
  try {
    const exists = await RNFS.exists(directoryPath);
    if (!exists) {
      await RNFS.mkdir(directoryPath);
    }
  } catch (e) {
    console.error('Error ensuring directory exists:', e);
    throw e;
  }
};

const ensureFileExists = async (filePath: string, defaultContent: any) => {
  try {
    const exists = await RNFS.exists(filePath);
    if (!exists) {
      await RNFS.writeFile(filePath, JSON.stringify(defaultContent));
    }
  } catch (e) {
    console.error('Error ensuring file exists:', e);
    throw e;
  }
};

const loadFlightLogs = async (): Promise<
  {key: string; details: string | null}[]
> => {
  try {
    await ensureDirectoryExists();
    await ensureFileExists(logsPath, []);
    const contents = await RNFS.readFile(logsPath);
    return JSON.parse(contents);
  } catch (e) {
    console.error('Error loading flight logs:', e);
    return [];
  }
};

const saveFlightLog = async (newLog: any) => {
  try {
    await ensureDirectoryExists();
    const contents = await RNFS.readFile(logsPath);
    const flightLogs = JSON.parse(contents);
    flightLogs.push(newLog);
    await RNFS.writeFile(logsPath, JSON.stringify(flightLogs));
  } catch (e) {
    console.error('Error saving flight log:', e);
    throw e;
  }
};

const jsonToCSV = (json: {key: string; details: string | null}[]): string => {
  const csvRows: string[] = [];
  const headers = Object.keys(json[0]);
  csvRows.push(headers.join(','));

  for (const row of json) {
    const values = headers.map(header => {
      const escaped = ('' + row[header as keyof typeof row]).replace(
        /"/g,
        '\\"',
      );
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

const exportFlightLogsToCSV = async () => {
  try {
    const flightLogs = await loadFlightLogs();
    if (flightLogs.length === 0) {
      throw new Error('No flight logs available to export');
    }
    const csv = jsonToCSV(flightLogs);
    await RNFS.writeFile(exportPath, csv);
    console.log('Exported to:', exportPath);
  } catch (e) {
    console.error('Error exporting flight logs to CSV:', e);
    throw e;
  }
};

export default {
  loadFlightLogs,
  saveFlightLog,
  exportFlightLogsToCSV,
};
