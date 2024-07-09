import { DocumentRepository } from "../application/document-repository.port";
import { FileStorage } from "../application/file-storage.port";
import { Document } from "../domain/document.aggregate";

export class InMemoryAdapter implements DocumentRepository {
    private documents: Document[] = [];

    constructor(private fileStorage: FileStorage) {
    }

    public async findById(id: string): Promise<Document | null> {
        return this.documents.find(doc => doc.id.value === id) || null;
    }

    public async save(document: Document): Promise<void> {
        this.documents = this.documents.filter(doc => doc.id !== document.id);
        this.documents.push(document);
    }

    public async delete(document: Document): Promise<void> {
        this.documents = this.documents.filter(doc => doc.id.value !== document.id.value);
    }

    public async saveWithFile(document: Document, file: Buffer): Promise<string> {
        const filePath = await this.fileStorage.save(file, `${document.id.value}.pdf`);
        return filePath;
    }
}