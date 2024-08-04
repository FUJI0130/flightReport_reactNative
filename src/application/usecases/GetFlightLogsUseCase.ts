// src/application/usecases/GetFlightLogsUseCase.ts
import {createFlightLogRepository} from '../../infrastructure/repositories/FlightLogRepositoryFactory';
import {FlightLog} from '../../domain/flightlog/FlightLog';

export class GetFlightLogsUseCase {
  async execute(fileName: string): Promise<FlightLog[]> {
    const flightLogRepository = await createFlightLogRepository();
    return await flightLogRepository.load(fileName);
  }

  async listFiles(): Promise<string[]> {
    const flightLogRepository = await createFlightLogRepository();
    return await flightLogRepository.listFiles();
  }
}
