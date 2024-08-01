// src/domain/models/FlightLog.ts
import {FlightDate} from '../shared/valueObjects/FlightDate';
import {Location} from './valueObjects/Location';
import {FlightDuration} from './valueObjects/FlightDuration';

export class FlightLog {
  constructor(
    public readonly key: string,
    public readonly date: FlightDate,
    public readonly pilotName: string,
    public readonly registrationNumber: string,
    public readonly flightPurposeAndRoute: string,
    public readonly takeoffLocationAndTime: Location,
    public readonly landingLocationAndTime: Location,
    public readonly flightDuration: FlightDuration,
    public readonly issues: string,
  ) {}

  toCSVRow(): string {
    return [
      this.key,
      this.date.toString(),
      this.pilotName,
      this.registrationNumber,
      this.flightPurposeAndRoute,
      `${this.takeoffLocationAndTime.location} ${this.takeoffLocationAndTime.time}`,
      `${this.landingLocationAndTime.location} ${this.landingLocationAndTime.time}`,
      this.flightDuration.toString(),
      this.issues,
    ].join(',');
  }
}
