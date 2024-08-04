import {CSVFlightLogRepository} from './CSVFlightLogRepository';
import {FlightLogRepository} from '../../domain/repositories/FlightLogRepository';
import {loadSettings} from './SettingsManager';

export const createFlightLogRepository =
  async (): Promise<FlightLogRepository> => {
    const settings = await loadSettings();

    return new CSVFlightLogRepository();
  };
