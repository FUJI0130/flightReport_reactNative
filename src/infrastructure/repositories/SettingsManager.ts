import RNFS from 'react-native-fs';

const settingsPath = `${RNFS.DownloadDirectoryPath}/flightReport/settings.json`;

const ensureSettingsFileExists = async () => {
  const exists = await RNFS.exists(settingsPath);
  if (!exists) {
    await RNFS.writeFile(
      settingsPath,
      JSON.stringify({priority: 'csv'}),
      'utf8',
    );
  }
};

export const loadSettings = async (): Promise<{priority: string}> => {
  const exists = await RNFS.exists(settingsPath);
  if (exists) {
    const contents = await RNFS.readFile(settingsPath);
    return JSON.parse(contents);
  }
  return {priority: 'csv'}; // デフォルトはcsv
};

export const saveSettings = async (settings: {
  priority: string;
}): Promise<void> => {
  await RNFS.writeFile(settingsPath, JSON.stringify(settings), 'utf8');
};
