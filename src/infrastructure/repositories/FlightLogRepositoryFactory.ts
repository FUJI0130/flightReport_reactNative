import {CSVFlightLogRepository} from './CSVFlightLogRepository';
import {FlightLogRepository} from '../../domain/repositories/FlightLogRepository';

export const createFlightLogRepository =
  async (): Promise<FlightLogRepository> => {
    return new CSVFlightLogRepository();
  };
