// src/application/usecases/AddFlightRecordUseCase.ts
import {createFlightLogRepository} from '../../infrastructure/repositories/FlightLogRepositoryFactory';
import {FlightLog} from '../../domain/models/FlightLog';

export class AddFlightRecordUseCase {
  async execute(details: string): Promise<void> {
    const flightLogRepository = await createFlightLogRepository();
    const newLog: FlightLog = {
      key: new Date().toISOString(),
      details,
    };
    await flightLogRepository.save(newLog);
  }
}
