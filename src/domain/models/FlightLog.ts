// src/domain/models/FlightLog.ts
// src/domain/models/FlightLog.ts

export interface FlightLog {
  key: string;
  date: string; // 飛行年月日
  pilotName: string; // 操縦者の氏名
  registrationNumber: string; // 無人航空機の登録記号
  flightPurposeAndRoute: string; // 飛行の目的と経路
  takeoffLocationAndTime: string; // 離陸場所と時刻
  landingLocationAndTime: string; // 着陸場所と時刻
  flightDuration: string; // 飛行時間
  issues: string; // 不具合の有無とその内容
}
