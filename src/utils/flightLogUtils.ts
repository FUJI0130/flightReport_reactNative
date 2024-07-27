import RNFS from 'react-native-fs';
import {FlightLog} from '../domain/models/FlightLog';

export const getFilesWithExtension = async (
  extension: string,
): Promise<string[]> => {
  const directoryPath = `${RNFS.DownloadDirectoryPath}/flightReport`;
  const files = await RNFS.readDir(directoryPath);
  return files
    .filter(file => file.name.endsWith(extension))
    .map(file => file.path);
};

export const validateCSVFormat = (csvContent: string): boolean => {
  if (!csvContent || csvContent.trim() === '') {
    return false;
  }
  const expectedHeaders = [
    'key',
    'date',
    'pilotName',
    'registrationNumber',
    'flightPurposeAndRoute',
    'takeoffLocationAndTime',
    'landingLocationAndTime',
    'flightDuration',
    'issues',
  ];
  const rows = csvContent.split('\n').filter(Boolean);
  const headers = rows[0].split(',');
  console.log('CSV Headers:', headers); // デバッグ情報追加
  console.log('Expected Headers:', expectedHeaders); // デバッグ情報追加
  return expectedHeaders.every((header, index) => header === headers[index]);
};

export const loadCSVFlightLogsFromFile = async (
  filePath: string,
): Promise<FlightLog[]> => {
  const csv = await RNFS.readFile(filePath);
  if (!csv || csv.trim() === '') {
    return [];
  }
  console.log(`CSV Content from ${filePath}: ${csv}`);
  const rows = csv.split('\n').filter(Boolean);
  const headers = rows[0].split(',');
  console.log(`CSV Headers: ${headers}`);

  const flightLogs: FlightLog[] = rows.slice(1).map(row => {
    const [
      key,
      date,
      pilotName,
      registrationNumber,
      flightPurposeAndRoute,
      takeoffLocationAndTime,
      landingLocationAndTime,
      flightDuration,
      issues,
    ] = row.split(',');
    return {
      key,
      date,
      pilotName,
      registrationNumber,
      flightPurposeAndRoute,
      takeoffLocationAndTime,
      landingLocationAndTime,
      flightDuration,
      issues,
    };
  });
  return flightLogs;
};
