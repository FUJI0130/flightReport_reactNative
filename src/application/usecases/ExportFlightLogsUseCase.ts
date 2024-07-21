import {FlightLogRepository} from '../../domain/repositories/FlightLogRepository';

export class ExportFlightLogsUseCase {
  constructor(private flightLogRepository: FlightLogRepository) {}

  async execute(): Promise<void> {
    await this.flightLogRepository.exportFlightLogsToCSV();
  }
}
