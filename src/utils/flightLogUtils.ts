import RNFS from 'react-native-fs';
import {FlightLog} from '../domain/models/FlightLog';

const directoryPath = `${RNFS.DownloadDirectoryPath}/flightReport`;

export const getFilesWithExtension = async (
  extension: string,
): Promise<string[]> => {
  const files = await RNFS.readDir(directoryPath);
  return files
    .filter(file => file.name.endsWith(extension))
    .map(file => file.path);
};

export const loadCSVFlightLogsFromFile = async (
  filePath: string,
): Promise<FlightLog[]> => {
  const csv = await RNFS.readFile(filePath);
  const rows = csv.split('\n');
  const flightLogs: FlightLog[] = rows.slice(1).map(row => {
    const [key, details] = row.split(',');
    return {key, details};
  });
  return flightLogs;
};

export const loadJSONFlightLogsFromFile = async (
  filePath: string,
): Promise<FlightLog[]> => {
  const contents = await RNFS.readFile(filePath);
  return JSON.parse(contents);
};
