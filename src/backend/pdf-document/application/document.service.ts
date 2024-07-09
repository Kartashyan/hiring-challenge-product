import { DomainError } from "src/backend/core/domain-error";
import { Result, fail, ok } from "src/backend/core/result";
import { DocumentRepository } from "./document-repository.port.ts";
import { MetadataDto, UploadDocumentDto } from "./document.dto.ts";
import { ProcessingAPI } from "./processing-api.port.ts";
import { Document, DocumentStatus } from "../domain/document.aggregate.ts";

export class DocumentService {
    constructor(private readonly documentRepository: DocumentRepository, private readonly processingApi: ProcessingAPI) { }

    async getMetadata(documentId: string): Promise<Result<MetadataDto | null>> {
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
}