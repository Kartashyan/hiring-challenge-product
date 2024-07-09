export interface FileStorage {
    save(file: Buffer, fileName: string): Promise<string>;
    delete(fileName: string): Promise<void>;
    get(fileName: string): Promise<Buffer>;
  }