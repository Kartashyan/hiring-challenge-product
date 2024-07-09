import { Document } from "../domain/document.aggregate";

export interface DocumentRepository {
    findById(id: string): Promise<Document | null>;
    save(document: Document): Promise<void>;
    saveWithFile(document: Document, file: Buffer): Promise<string>;
    delete(document: Document): Promise<void>;
}