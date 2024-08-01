// src/application/usecases/AddFlightRecordUseCase.ts
import {createFlightLogRepository} from '../../infrastructure/repositories/FlightLogRepositoryFactory';
import {FlightLog} from '../../domain/flightlog/FlightLog';
import {FlightDate} from '../../domain/shared/valueObjects/FlightDate';
import {Location} from '../../domain/flightlog/valueObjects/Location';

export class AddFlightRecordUseCase {
  async execute(details: any): Promise<void> {
    const flightLogRepository = await createFlightLogRepository();
    const newLog = new FlightLog(
      new Date().toISOString(),
      FlightDate.create(details.date),
      details.pilotName,
      details.registrationNumber,
      details.flightPurposeAndRoute,
      Location.create(details.takeoffLocation, details.takeoffTime),
      Location.create(details.landingLocation, details.landingTime),
      details.flightDuration,
      details.issues,
    );
    await flightLogRepository.save(newLog);
  }
}
