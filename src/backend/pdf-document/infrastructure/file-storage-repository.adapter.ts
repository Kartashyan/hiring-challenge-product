// src/infrastructure/services/LocalFileStorage.ts

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { FileStorage } from '../application/file-storage.port';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

export class LocalFileStorage implements FileStorage {
  private storagePath: string;

  constructor(storagePath: string) {
    this.storagePath = storagePath;
  }

  async save(file: Buffer, fileName: string): Promise<string> {
    const filePath = path.join(this.storagePath, fileName);
    try { await writeFile(filePath, file); } catch (error) { console.log("----error---",error); throw error;}
    return filePath;
  }

  async delete(fileName: string): Promise<void> {
    const filePath = path.join(this.storagePath, fileName);
    await unlink(filePath);
  }

  async get(fileName: string): Promise<Buffer> {
    const filePath = path.join(this.storagePath, fileName);
    return await readFile(filePath);
  }
}
