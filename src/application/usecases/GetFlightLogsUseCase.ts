import {FlightLogRepository} from '../../domain/repositories/FlightLogRepository';
import {FlightLog} from '../../domain/models/FlightLog';

export class GetFlightLogsUseCase {
  constructor(private flightLogRepository: FlightLogRepository) {}

  async execute(): Promise<FlightLog[]> {
    return await this.flightLogRepository.loadFlightLogs();
  }
}
