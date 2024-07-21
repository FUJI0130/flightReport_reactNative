# Step7_Tests.md

## ユニットテストの追加と実行

各層のテストを追加し、ユニットテストを実行してプロジェクトの品質を確保します。

### ユースケースのユニットテスト

`AddFlightRecordUseCase`のユニットテストを追加します。

```typescript
// src/application/usecases/__tests__/AddFlightRecordUseCase.test.ts
import { AddFlightRecordUseCase } from '../AddFlightRecordUseCase';
import { FlightLogRepository } from '../../../domain/repositories/FlightLogRepository';
import { FlightLog } from '../../../domain/models/FlightLog';

class MockFlightLogRepository implements FlightLogRepository {
  private logs: FlightLog[] = [];

  async loadFlightLogs(): Promise<FlightLog[]> {
    return this.logs;
  }

  async saveFlightLog(newLog: FlightLog): Promise<void> {
    this.logs.push(newLog);
  }

  async exportFlightLogsToCSV(): Promise<void> {
    // Do nothing
  }
}

describe('AddFlightRecordUseCase', () => {
  it('should add a flight record', async () => {
    const repository = new MockFlightLogRepository();
    const useCase = new AddFlightRecordUseCase(repository);

    const newLog: FlightLog = { key: '2024-07-21T10:00:00Z', details: 'Test flight' };
    await useCase.execute(newLog);

    const logs = await repository.loadFlightLogs();
    expect(logs).toContainEqual(newLog);
  });
});
```

同様に、ExportFlightLogsUseCaseとGetFlightLogsUseCaseのテストも追加します。

### ExportFlightLogsUseCaseのユニットテスト
```typescript

// src/application/usecases/__tests__/ExportFlightLogsUseCase.test.ts
import { ExportFlightLogsUseCase } from '../ExportFlightLogsUseCase';
import { FlightLogRepository } from '../../../domain/repositories/FlightLogRepository';
import { FlightLog } from '../../../domain/models/FlightLog';

class MockFlightLogRepository implements FlightLogRepository {
  private logs: FlightLog[] = [];

  async loadFlightLogs(): Promise<FlightLog[]> {
    return this.logs;
  }

  async saveFlightLog(newLog: FlightLog): Promise<void> {
    this.logs.push(newLog);
  }

  async exportFlightLogsToCSV(): Promise<void> {
    // Do nothing
  }
}

describe('ExportFlightLogsUseCase', () => {
  it('should export flight logs to CSV', async () => {
    const repository = new MockFlightLogRepository();
    const useCase = new ExportFlightLogsUseCase(repository);

    const newLog: FlightLog = { key: '2024-07-21T10:00:00Z', details: 'Test flight' };
    await repository.saveFlightLog(newLog);

    await expect(useCase.execute()).resolves.not.toThrow();
  });
});
```

### GetFlightLogsUseCaseのユニットテスト
```typescript

// src/application/usecases/__tests__/GetFlightLogsUseCase.test.ts
import { GetFlightLogsUseCase } from '../GetFlightLogsUseCase';
import { FlightLogRepository } from '../../../domain/repositories/FlightLogRepository';
import { FlightLog } from '../../../domain/models/FlightLog';

class MockFlightLogRepository implements FlightLogRepository {
  private logs: FlightLog[] = [];

  async loadFlightLogs(): Promise<FlightLog[]> {
    return this.logs;
  }

  async saveFlightLog(newLog: FlightLog): Promise<void> {
    this.logs.push(newLog);
  }

  async exportFlightLogsToCSV(): Promise<void> {
    // Do nothing
  }
}

describe('GetFlightLogsUseCase', () => {
  it('should get flight logs', async () => {
    const repository = new MockFlightLogRepository();
    const useCase = new GetFlightLogsUseCase(repository);

    const newLog: FlightLog = { key: '2024-07-21T10:00:00Z', details: 'Test flight' };
    await repository.saveFlightLog(newLog);

    const logs = await useCase.execute();
    expect(logs).toContainEqual(newLog);
  });
});
```

### 統合テストの追加と実行
アプリ全体の動作を確認するための統合テストを追加します。

## 統合テストのセットアップ
Jestを利用して統合テストを実行します。まず、Jestのセットアップを行います。


```javascript

// jest.config.js
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation)',
  ],
};

// jest.setup.js
import 'react-native-gesture-handler/jestSetup';

```

### 統合テストの実行
以下のコマンドで統合テストを実行します。

```bash
npx jest --config jest.config.js
```

統合テストの結果を確認し、必要に応じて修正を行います。

