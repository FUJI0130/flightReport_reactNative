// src/domain/repositories/FlightLogRepository.ts
import {FlightLog} from '../flightlog/FlightLog';

export interface FlightLogRepository {
  listFiles(): Promise<string[]>; // ファイル一覧を取得するメソッド
  load(fileName: string): Promise<FlightLog[]>; // ファイル名を引数に取るメソッド
  save(flightLog: FlightLog, fileName?: string): Promise<void>;
  export(): Promise<void>;
}
