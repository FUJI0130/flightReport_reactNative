import {FlightLogRepository} from '../../domain/repositories/FlightLogRepository';
import {FlightLog} from '../../domain/models/FlightLog';

export class AddFlightRecordUseCase {
  constructor(private flightLogRepository: FlightLogRepository) {}

  async execute(details: string): Promise<void> {
    const newLog: FlightLog = {
      key: new Date().toISOString(),
      details,
    };
    await this.flightLogRepository.saveFlightLog(newLog);
  }
}
