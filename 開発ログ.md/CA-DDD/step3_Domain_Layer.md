# Step3_Domain_Layer.md

## モデルクラスの作成

1. `FlightLog` インターフェースを作成

   `src/domain/models/FlightLog.ts` を作成し、以下の内容を追加します。

   ```typescript
   // src/domain/models/FlightLog.ts
   export interface FlightLog {
     key: string;
     details: string | null;
   }

2. `FlightLogRepository` インターフェースを作成

`src/domain/repositories/FlightLogRepository.ts` を作成し、以下の内容を追加します。

```typescript
// src/domain/repositories/FlightLogRepository.ts
import { FlightLog } from '../models/FlightLog';

export interface FlightLogRepository {
  loadFlightLogs(): Promise<FlightLog[]>;
  saveFlightLog(newLog: FlightLog): Promise<void>;
  exportFlightLogsToCSV(): Promise<void>;
}
```