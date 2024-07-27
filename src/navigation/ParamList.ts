import {FlightLog} from '../domain/models/FlightLog';

export type RootStackParamList = {
  Home: undefined;
  Detail: {record: FlightLog};
  AddRecord: undefined;
  Export: undefined;
  NewFlightLog: undefined;
  FlightRecords: {newFileName?: string};
};
