import { eq } from "drizzle-orm";
import { db } from "src/backend/infrastructure/db";
import { documentTable, metadataTable } from "src/backend/infrastructure/schema";
import { DocumentRepository } from "../application/document-repository.port";
import { FileStorage } from "../application/file-storage.port";
import { Document } from "../domain/document.aggregate";
import { DocumentMapper } from "./document.mapper";
import { DocumentModel } from "../application/document.dto";


export class SQLiteAdapter implements DocumentRepository {
    constructor(private fileStorage: FileStorage) {
    }

    private async documentExists(id: string): Promise<boolean> {
        const document = await db.query.documentTable.findFirst({
            where: (table, funcs) => funcs.eq(table.id, id),
        });
        return !!document;
    }

    private async metadataExists(documentId: string): Promise<boolean> {
        const metadata = await db.query.metadataTable.findFirst({
            where: (table, funcs) => funcs.eq(table.documentId, documentId),
        });
        return !!metadata;
    }

    async save(document: Document): Promise<void> {
        if (await this.documentExists(document.id.value)) {
            await db.transaction(async (tx) => {
                await tx.update(documentTable).set({
                    status: document.status,
                    updatedAt: document.updatedAt,
                    uploadedAt: document.uploadedAt,
                }).where(eq(documentTable.id, document.id.value));

                if (document.metadata) {
                    if (await this.metadataExists(document.id.value)) {
                        await tx.update(metadataTable).set({
                            name: document.metadata.name,
                            author: document.metadata.author,
                            kind: document.metadata.kind,
                        }).where(eq(metadataTable.documentId, document.id.value));
                    }
                    else {
                        await tx.insert(metadataTable).values({
                            name: document.metadata.name,
                            author: document.metadata.author,
                            kind: document.metadata.kind,
                            documentId: document.id.value,
                        });
                    }
                }
            });
        } else {
            await db.transaction(async (tx) => {
                await tx.insert(documentTable).values({
                    id: document.id.value,
                    status: document.status,
                    updatedAt: document.updatedAt,
                    uploadedAt: document.uploadedAt,
                }).returning();

                if (document.metadata) {
                    await tx.insert(metadataTable).values({
                        name: document.metadata.name,
                        author: document.metadata.author,
                        kind: document.metadata.kind,
                        documentId: document.id.value,
                    });
                }
            });
        }
    }

    async saveWithFile(document: Document, file: Buffer): Promise<string> {
        const filePath = await this.fileStorage.save(file, `${document.id.value}.pdf`);
        return filePath;
    }

    async findById(id: string): Promise<Document | null> {
        const document = await db.query.documentTable.findFirst({
            where: (table, funcs) => funcs.eq(table.id, id),
            with: {
                metadata: true,
            },
        })
        if (!document) return null;
        return DocumentMapper.toDomain(document);
    }

    async list(): Promise<DocumentModel[]> {
        const documents = await db.query.documentTable.findMany({
            with: {
                metadata: {
                    columns: {
                        name: true,
                        author: true,
                        kind: true,
                    },
                },
            },
        });
        return documents;
    }

    async delete(document: Document): Promise<void> {
        try {
            await db.transaction(async (tx) => {
                await tx.delete(metadataTable).where(eq(metadataTable.documentId, document.id.value));
                await tx.delete(documentTable).where(eq(documentTable.id, document.id.value));
            });
        } catch (e) { console.error("Error deleting document:", e); }

    }
}
