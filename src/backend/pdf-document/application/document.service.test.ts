import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DocumentKind } from "../domain/document-kind.value-object";
import { Document } from "../domain/document.aggregate";
import { Metadata } from "../domain/metadata.value-object";
import { DocumentRepository } from "./document-repository.port";
import { DocumentService } from "./document.service";
import { ProcessingAPI } from "./processing-api.port";

describe('DocumentService', () => {
    let documentService: DocumentService;
    let mockDocumentRepository: Partial<DocumentRepository>;
    let mockProcessingApi: Partial<ProcessingAPI>;
  
    beforeEach(() => {
      mockDocumentRepository = {
        findById: vi.fn(),
        saveWithFile: vi.fn(),
        save: vi.fn(),
      };
  
      mockProcessingApi = {
        processDocument: vi.fn().mockImplementation(documentId => Promise.resolve())
      };
  
      documentService = new DocumentService(mockDocumentRepository as DocumentRepository, mockProcessingApi as ProcessingAPI);
    });
  
    afterEach(() => {
      vi.clearAllMocks();
    });

    describe('getMetadata', () => {
        it('should return the metadata when the document is found', async () => {
            const metadata = new Metadata("Document Name", "Author Name", new DocumentKind("regulation"));
            const document = Document.create({
                metadata: metadata,
                uploadedAt: new Date(),
                updatedAt: new Date(),
                filePath: null,
            });
            vi.spyOn(mockDocumentRepository, 'findById').mockResolvedValue(document);
            const metadataDto = await documentService.getMetadata(document.id.value);
            expect(metadataDto.success).toBe(true);
            if(metadataDto.success) {
                expect(metadataDto.value).toEqual(metadata.toObject());
            }
        });

        it('should return an error when the document is not found', async () => {

        });

        it('should return an error when an error occurs while getting the document metadata', async () => {

        });
    });
});