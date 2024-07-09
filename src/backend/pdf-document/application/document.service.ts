import { DomainError } from "src/backend/core/domain-error";
import { Result, fail, ok } from "src/backend/core/result";
import { DocumentRepository } from "./document-repository.port.ts";
import { MetadataDto } from "./document.dto.ts";
import { ProcessingAPI } from "./processing-api.port.ts";

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
}