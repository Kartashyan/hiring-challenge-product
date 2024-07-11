import { Document } from "../domain/document.aggregate";
import { DocumentModel } from "./document.dto";

export interface DocumentRepository {
    findById(id: string): Promise<Document | null>;
    list(): Promise<DocumentModel[]>;
    save(document: Document): Promise<void>;
    saveWithFile(document: Document, file: Buffer): Promise<string>;
    delete(document: Document): Promise<void>;
}