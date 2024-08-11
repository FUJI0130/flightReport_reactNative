import {FlightLog} from '../domain/flightlog/FlightLog';

// src/navigation/ParamList.ts
export type RootStackParamList = {
  Home: undefined;
  AddRecord: undefined;
  Detail: {record: FlightLog};
  Export: undefined;
  FlightRecords: {newFileName?: string};
  NewFlightLog: undefined;
  FlightTimer: {
    flightDetails: {
      pilotName: string;
      registrationNumber: string;
      flightPurposeAndRoute: string;
      takeoffLocation: string;
      landingLocation: string;
    };
  };
};
