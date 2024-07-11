import { DomainError } from "src/backend/core/domain-error";
import { fail, ok, Result } from "src/backend/core/result";
import { DocumentKind } from "../domain/document-kind.value-object.ts";
import { DocumentStatus } from "../domain/document-status.value-object.ts";
import { Document } from "../domain/document.aggregate.ts";
import { Metadata } from "../domain/metadata.value-object.ts";
import { DocumentRepository } from "./document-repository.port.ts";
import { DocumentModel, MetadataModel, UploadDocumentDto } from "./document.dto.ts";
import { ProcessingAPI } from "./processing-api.port.ts";

export class DocumentService {
    constructor(private readonly documentRepository: DocumentRepository, private readonly processingApi: ProcessingAPI) { }

    async getMetadata(documentId: string): Promise<Result<MetadataModel | null>> {
        try {
            const document = await this.documentRepository.findById(documentId);
            if (!document) {
                return fail("Document not found.");
            }

            const metadata = document.getMetadata()?.toObject() || null;

            return ok(metadata);
        } catch (error) {
            if (error instanceof DomainError) {
                return fail(error.message);
            } else {
                return fail("An error occurred while trying to get the document metadata.");
            }
        }
    }

    async uploadDocument(uploadDto: UploadDocumentDto): Promise<Result<void>> {
        try {
            const document = Document.create({
                metadata: null,
                uploadedAt: new Date(),
                updatedAt: new Date(),
                filePath: null,
            });

            const filePath = await this.documentRepository.saveWithFile(document, uploadDto.file);

            document.updateFilePath(filePath);
            document.updateStatus(DocumentStatus.PENDING);
            await this.documentRepository.save(document);

            return ok(undefined);
        } catch (error) {
            if (error instanceof DomainError) {
                return fail(error.message);
            } else {
                return fail("An error occurred while uploading the document."); //server error
            }
        }
    }

    async getFilePath(documentId: string): Promise<Result<string | null>> {
        try {
            const document = await this.documentRepository.findById(documentId);
            if (!document) {
                return fail("Document not found.");
            }

            return ok(document.getFilePath());
        } catch (error) {
            if (error instanceof DomainError) {
                return fail(error.message);
            } else {
                return fail("An error occurred while trying to get the document file path.");
            }
        }
    }

    async updateMetadata(documentId: string, metadataDto: MetadataModel): Promise<Result<void>> {
        try {
            const document = await this.documentRepository.findById(documentId);
            if (!document) {
                return fail("Document not found.");
            }

            document.updateMetadata(new Metadata(
                metadataDto.name || "",
                metadataDto.author || "",
                new DocumentKind(metadataDto.kind),
            ));

            await this.documentRepository.save(document);
            await this.processingApi.processDocument(document.id.value);

            document.updateStatus(DocumentStatus.PROCESSING);
            await this.documentRepository.save(document);

            return ok(undefined);
        } catch (error) {
            if (error instanceof DomainError) {
                return fail(error.message);
            } else {
                return fail("An error occurred while updating the document metadata.");
            }
        }
    }

    async markAsProcessed(id: string): Promise<Result<void>> {
        try {
            const document = await this.documentRepository.findById(id);
            if (!document) {
                return fail("Document not found.");
            }

            document.updateStatus(DocumentStatus.PROCESSED);

            await this.documentRepository.save(document);

            return ok(undefined);
        } catch (error) {
            if (error instanceof DomainError) {
                return fail(error.message);
            } else {
                return fail("An error occurred while trying to mark document as processed.");
            }
        }
    }

    async deleteDocument(id: string): Promise<Result<void>> {
        try {
            const document = await this.documentRepository.findById(id);
            if (!document) {
                return fail("Document not found.");
            }
            
            await this.documentRepository.delete(document);

            return ok(undefined);
        } catch (error) {
            if (error instanceof DomainError) {
                return fail(error.message);
            } else {
                return fail("An error occurred while trying to delete the document.");
            }
        }
    }

    async getAllDocuments(): Promise<Result<DocumentModel[]>> {
        try {
            const documents = await this.documentRepository.list();
            return ok(documents);
        } catch (error) {
            if (error instanceof DomainError) {
                return fail(error.message);
            } else {
                return fail("An error occurred while trying to get the processed documents.");
            }
        }
    }

}

