// src/application/usecases/GetFlightLogsUseCase.ts
import {createFlightLogRepository} from '../../infrastructure/repositories/FlightLogRepositoryFactory';
import {FlightLog} from '../../domain/models/FlightLog';

export class GetFlightLogsUseCase {
  async execute(): Promise<FlightLog[]> {
    const flightLogRepository = await createFlightLogRepository();
    return await flightLogRepository.load();
  }
}
