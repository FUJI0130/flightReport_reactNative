// src/application/usecases/ExportFlightLogsUseCase.ts
import {createFlightLogRepository} from '../../infrastructure/repositories/FlightLogRepositoryFactory';

export class ExportFlightLogsUseCase {
  async execute(): Promise<void> {
    const flightLogRepository = await createFlightLogRepository();
    await flightLogRepository.export();
  }
}
