// src/utils/flightLogUtils.ts
import RNFS from 'react-native-fs';
import {FlightLog} from '../domain/flightlog/FlightLog';
import {FlightDate} from '../domain/shared/valueObjects/FlightDate';
import {Location} from '../domain/flightlog/valueObjects/Location';
import {FlightDuration} from '../domain/flightlog/valueObjects/FlightDuration';

const directoryPath = `${RNFS.DownloadDirectoryPath}/flightReport`;

export const ensureDirectoryExists = async () => {
  const exists = await RNFS.exists(directoryPath);
  if (!exists) {
    await RNFS.mkdir(directoryPath);
  }
};

export const getFilesWithExtension = async (
  extension: string,
): Promise<string[]> => {
  await ensureDirectoryExists();
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
  console.log('validateCSVFormat: CSV Headers:', headers); // デバッグ情報追加
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

    const [takeoffLocation, takeoffTime] = takeoffLocationAndTime.split(' ');
    const [landingLocation, landingTime] = landingLocationAndTime.split(' ');

    return new FlightLog(
      key,
      FlightDate.create(date),
      pilotName,
      registrationNumber,
      flightPurposeAndRoute,
      Location.create(takeoffLocation, takeoffTime),
      Location.create(landingLocation, landingTime),
      FlightDuration.create(parseInt(flightDuration)),
      issues || '', // ここでissuesがundefinedの場合に空文字列を設定
    );
  });
  return flightLogs;
};

// JSON用の関数も追加する
export const loadJSONFlightLogsFromFile = async (
  filePath: string,
): Promise<FlightLog[]> => {
  const json = await RNFS.readFile(filePath);
  if (!json || json.trim() === '') {
    return [];
  }
  return JSON.parse(json).map(
    (item: any) =>
      new FlightLog(
        item.key,
        FlightDate.create(item.date),
        item.pilotName,
        item.registrationNumber,
        item.flightPurposeAndRoute,
        Location.create(item.takeoffLocation, item.takeoffTime),
        Location.create(item.landingLocation, item.landingTime),
        FlightDuration.create(item.flightDuration),
        item.issues || '',
      ),
  );
};
