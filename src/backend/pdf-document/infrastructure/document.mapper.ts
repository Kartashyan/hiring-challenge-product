import { DocumentDBModel } from "src/backend/infrastructure/schema";
import { Document } from "../domain/document.aggregate";
import { Metadata } from "../domain/metadata.value-object";
import { UID } from "src/backend/core/id";
import { DocumentStatus } from "../domain/document-status.value-object";
import { DocumentKind } from "../domain/document-kind.value-object";
import { DocumentModel } from "../domain/document.model";

export class DocumentMapper {
    static toDomain(document: DocumentDBModel): Document {
        return Document.create({
            uploadedAt: new Date(document.uploadedAt),
            updatedAt: new Date(document.updatedAt),
            filePath: document.filePath,
            metadata: document.metadata ? new Metadata(document.metadata?.name || "", document.metadata?.author || "", new DocumentKind(document.metadata?.kind || "")) : null,
        }, new UID(document.id), new DocumentStatus(document.status).value);
    }

    static toDTO(document: Document): DocumentModel {
        return {
            id: document.id.value,
            status: document.status,
            filePath: document.filePath,
            uploadedAt: document.uploadedAt,
            updatedAt: document.updatedAt,
            metadata: {
                name: document.metadata?.name || null,
                author: document.metadata?.author || null,
                kind: document.metadata?.kind || null,

            }
        };
    }
}