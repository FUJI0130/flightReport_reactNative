export interface IDataStore<T> {
  listFiles(): Promise<string[]>; // ファイル一覧を取得するメソッドを追加
  load(fileName: string): Promise<T[]>; // ファイル名を引数に取るように変更
  save(item: T, fileName?: string): Promise<void>;
  export(): Promise<void>;
}
