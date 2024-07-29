// src/domain/models/FlightLog.ts
import {FlightDate} from '../shared/valueObjects/FlightDate';
import {Location} from './valueObjects/Location';

export class FlightLog {
  constructor(
    public readonly key: string,
    public readonly date: FlightDate,
    public readonly pilotName: string,
    public readonly registrationNumber: string,
    public readonly flightPurposeAndRoute: string,
    public readonly takeoffLocationAndTime: Location,
    public readonly landingLocationAndTime: Location,
    public readonly flightDuration: string,
    public readonly issues: string,
  ) {}
}
