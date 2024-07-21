import {FlightLog} from '../models/FlightLog';

export interface FlightLogRepository {
  loadFlightLogs(): Promise<FlightLog[]>;
  saveFlightLog(newLog: FlightLog): Promise<void>;
  exportFlightLogsToCSV(): Promise<void>;
}
