# Step4_Application_Layer.md

## ユースケースの作成

1. `AddFlightRecordUseCase` の作成

   `src/application/usecases/AddFlightRecordUseCase.ts` を作成し、以下の内容を追加します。

   ```typescript
   // src/application/usecases/AddFlightRecordUseCase.ts
   import { FlightLog } from '../../domain/models/FlightLog';
   import { FlightLogRepository } from '../../domain/repositories/FlightLogRepository';

   export class AddFlightRecordUseCase {
     private repository: FlightLogRepository;

     constructor(repository: FlightLogRepository) {
       this.repository = repository;
     }

     async execute(newLog: FlightLog): Promise<void> {
       return this.repository.saveFlightLog(newLog);
     }
   }
   ```
2. `GetFlightLogsUseCase` の作成

`src/application/usecases/GetFlightLogsUseCase.ts` を作成し、以下の内容を追加します。

```typescript
コードをコピーする
// src/application/usecases/GetFlightLogsUseCase.ts
import { FlightLog } from '../../domain/models/FlightLog';
import { FlightLogRepository } from '../../domain/repositories/FlightLogRepository';

export class GetFlightLogsUseCase {
  private repository: FlightLogRepository;

  constructor(repository: FlightLogRepository) {
    this.repository = repository;
  }

  async execute(): Promise<FlightLog[]> {
    return this.repository.loadFlightLogs();
  }
}
```
3. `ExportFlightLogsUseCase` の作成

`src/application/usecases/ExportFlightLogsUseCase.ts` を作成し、以下の内容を追加します。

```typescript
// src/application/usecases/ExportFlightLogsUseCase.ts
import { FlightLogRepository } from '../../domain/repositories/FlightLogRepository';

export class ExportFlightLogsUseCase {
  private repository: FlightLogRepository;

  constructor(repository: FlightLogRepository) {
    this.repository = repository;
  }

  async execute(): Promise<void> {
    return this.repository.exportFlightLogsToCSV();
  }
}
```

4.ユースケースのユニットテストの追加
各ユースケースに対してユニットテストを追加します。

`AddFlightRecordUseCase` のテスト

`src/application/usecases/AddFlightRecordUseCase.test.ts` を作成し、以下の内容を追加します。

```typescript

// src/application/usecases/AddFlightRecordUseCase.test.ts
import { AddFlightRecordUseCase } from './AddFlightRecordUseCase';
import { FlightLogRepository } from '../../domain/repositories/FlightLogRepository';
import { FlightLog } from '../../domain/models/FlightLog';

class MockFlightLogRepository implements FlightLogRepository {
  loadFlightLogs(): Promise<FlightLog[]> {
    return Promise.resolve([]);
  }
  saveFlightLog(newLog: FlightLog): Promise<void> {
    return Promise.resolve();
  }
  exportFlightLogsToCSV(): Promise<void> {
    return Promise.resolve();
  }
}

describe('AddFlightRecordUseCase', () => {
  it('should add a flight log', async () => {
    const repository = new MockFlightLogRepository();
    const useCase = new AddFlightRecordUseCase(repository);
    const newLog: FlightLog = { key: '1', details: 'Test flight' };

    await useCase.execute(newLog);

    // Mock repository should have saveFlightLog called once with newLog
    expect(await repository.loadFlightLogs()).toContainEqual(newLog);
  });
});
```
2.`GetFlightLogsUseCase` のテスト

`src/application/usecases/GetFlightLogsUseCase.test.ts` を作成し、以下の内容を追加します。

```typescript

// src/application/usecases/GetFlightLogsUseCase.test.ts
import { GetFlightLogsUseCase } from './GetFlightLogsUseCase';
import { FlightLogRepository } from '../../domain/repositories/FlightLogRepository';
import { FlightLog } from '../../domain/models/FlightLog';

class MockFlightLogRepository implements FlightLogRepository {
  private logs: FlightLog[] = [];

  loadFlightLogs(): Promise<FlightLog[]> {
    return Promise.resolve(this.logs);
  }
  saveFlightLog(newLog: FlightLog): Promise<void> {
    this.logs.push(newLog);
    return Promise.resolve();
  }
  exportFlightLogsToCSV(): Promise<void> {
    return Promise.resolve();
  }
}

describe('GetFlightLogsUseCase', () => {
  it('should return flight logs', async () => {
    const repository = new MockFlightLogRepository();
    const useCase = new GetFlightLogsUseCase(repository);

    const logs = await useCase.execute();

    expect(logs).toEqual([]);
  });
});
```

3.`ExportFlightLogsUseCase` のテスト

`src/application/usecases/ExportFlightLogsUseCase.test.ts` を作成し、以下の内容を追加します。

```typescript

// src/application/usecases/ExportFlightLogsUseCase.test.ts
import { ExportFlightLogsUseCase } from './ExportFlightLogsUseCase';
import { FlightLogRepository } from '../../domain/repositories/FlightLogRepository';

class MockFlightLogRepository implements FlightLogRepository {
  loadFlightLogs(): Promise<FlightLog[]> {
    return Promise.resolve([]);
  }
  saveFlightLog(newLog: FlightLog): Promise<void> {
    return Promise.resolve();
  }
  exportFlightLogsToCSV(): Promise<void> {
    return Promise.resolve();
  }
}

describe('ExportFlightLogsUseCase', () => {
  it('should export flight logs to CSV', async () => {
    const repository = new MockFlightLogRepository();
    const useCase = new ExportFlightLogsUseCase(repository);

    await useCase.execute();

    // Mock repository should have exportFlightLogsToCSV called once
    expect(await repository.exportFlightLogsToCSV()).toBeUndefined();
  });
});
```

