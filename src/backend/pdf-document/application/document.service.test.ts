import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DocumentKind } from "../domain/document-kind.value-object";
import { Document, DocumentStatus } from "../domain/document.aggregate";
import { Metadata } from "../domain/metadata.value-object";
import { DocumentRepository } from "./document-repository.port";
import { DocumentService } from "./document.service";
import { ProcessingAPI } from "./processing-api.port";
import { UploadDocumentDto } from "./document.dto";
import { fail, ok } from "src/backend/core/result";
import { DomainError } from "src/backend/core/domain-error";
import { UID } from "src/backend/core/id";

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
            if (metadataDto.success) {
                expect(metadataDto.value).toEqual(metadata.toObject());
            }
        });

        it('should return an error when the document is not found', async () => {

        });

        it('should return an error when an error occurs while getting the document metadata', async () => {

        });
    });

    describe('uploadDocument', () => {
        it('should successfully upload a document', async () => {
            const uploadDto: UploadDocumentDto = { file: Buffer.from('file content') };

            const result = await documentService.uploadDocument(uploadDto);

            expect(result).toEqual(ok(undefined));
            expect(mockDocumentRepository.saveWithFile).toHaveBeenCalled();
            expect(mockDocumentRepository.save).toHaveBeenCalled();
        });

        it('should return a domain error if saving the document fails with a domain error', async () => {
            mockDocumentRepository.saveWithFile = vi.fn().mockRejectedValue(new DomainError('Domain error'));

            const uploadDto: UploadDocumentDto = { file: Buffer.from('file content') };

            const result = await documentService.uploadDocument(uploadDto);

            expect(result).toEqual(fail('Domain error'));
        });

        it('should return a generic error message for non-domain errors', async () => {
            mockDocumentRepository.saveWithFile = vi.fn().mockRejectedValue(new Error('Generic error'));

            const uploadDto: UploadDocumentDto = { file: Buffer.from('file content') };

            const result = await documentService.uploadDocument(uploadDto);

            expect(result).toEqual(fail('An error occurred while uploading the document.'));
        });
    });

    describe('updateMetadata', () => {
        it('should successfully update document metadata', async () => {
            const documentId = new UID();
            const metadataDto = { kind: 'regulation', author: 'John Doe', name: 'Detailed Report' };
            const existingDocument = Document.create({
                metadata: null,
                uploadedAt: new Date(),
                updatedAt: new Date(),
                filePath: 'path/to/existing/document',
            }, documentId);

            mockDocumentRepository.findById = vi.fn().mockResolvedValue(existingDocument);

            const result = await documentService.updateMetadata(documentId.value, metadataDto);

            expect(result).toEqual(ok(undefined));
            expect(mockDocumentRepository.save).toHaveBeenCalled();
        });

        it('should return "Document not found." if the document does not exist', async () => {
            const documentId = 'non-existent-document-id';
            const metadataDto = { kind: 'regulation', author: 'John Doe', name: 'Detailed Report' };

            mockDocumentRepository.findById = vi.fn().mockResolvedValue(null);

            const result = await documentService.updateMetadata(documentId, metadataDto);

            expect(result).toEqual(fail('Document not found.'));
        });

        it('should return a domain error if updating metadata fails with a domain error', async () => {
            const documentId = new UID();
            const metadataDto = { kind: 'regulation', author: 'John Doe', name: 'Detailed Report' };
            const existingDocument = Document.create({
                metadata: null,
                uploadedAt: new Date(),
                updatedAt: new Date(),
                filePath: 'path/to/existing/document',
            }, documentId);

            mockDocumentRepository.findById = vi.fn().mockResolvedValue(existingDocument);
            mockDocumentRepository.save = vi.fn().mockRejectedValue(new DomainError('Domain error'));

            const result = await documentService.updateMetadata(documentId.value, metadataDto);

            expect(result).toEqual(fail('Domain error'));
        });

        it('should return a generic error message for non-domain errors', async () => {
            const documentId = 'some-document-id';
            const metadataDto = { kind: 'regulation', author: 'John Doe', name: 'Detailed Report' };
            const existingDocument = Document.create({
                metadata: null,
                uploadedAt: new Date(),
                updatedAt: new Date(),
                filePath: 'path/to/existing/document',
            });

            mockDocumentRepository.findById = vi.fn().mockResolvedValue(existingDocument);
            mockDocumentRepository.save = vi.fn().mockRejectedValue(new Error('Generic error'));

            const result = await documentService.updateMetadata(documentId, metadataDto);

            expect(result).toEqual(fail('An error occurred while updating the document metadata.'));
        });
    });
    
    describe('markAsProcessed', () => {
        it('should successfully mark a document as processed', async () => {
          const documentId = new UID();
          const existingDocument = Document.create({
            metadata: null,
            uploadedAt: new Date(),
            updatedAt: new Date(),
            filePath: 'path/to/existing/document',
          }, documentId);
      
          mockDocumentRepository.findById = vi.fn().mockResolvedValue(existingDocument);
      
          const result = await documentService.markAsProcessed(documentId.value);
      
          expect(result).toEqual(ok(undefined));
          expect(existingDocument.status).toEqual(DocumentStatus.PROCESSED);
          expect(mockDocumentRepository.save).toHaveBeenCalledWith(existingDocument);
        });
      
        it('should return "Document not found." if the document does not exist', async () => {
          const documentId = 'non-existent-document-id';
      
          mockDocumentRepository.findById = vi.fn().mockResolvedValue(null);
      
          const result = await documentService.markAsProcessed(documentId);
      
          expect(result).toEqual(fail('Document not found.'));
        });
      
        it('should return a domain error if mark the document sa processed fails with a domain error', async () => {
          const documentId = new UID();
          const existingDocument = Document.create({
            metadata: null,
            uploadedAt: new Date(),
            updatedAt: new Date(),
            filePath: 'path/to/existing/document',
          }, documentId);
      
          mockDocumentRepository.findById = vi.fn().mockResolvedValue(existingDocument);
          mockDocumentRepository.save = vi.fn().mockRejectedValue(new DomainError('Domain error'));
      
          const result = await documentService.markAsProcessed(documentId.value);
      
          expect(result).toEqual(fail('Domain error'));
        });
      
        it('should return a generic error message for non-domain errors', async () => {
          const documentId = new UID();
          const existingDocument = Document.create({
            metadata: null,
            uploadedAt: new Date(),
            updatedAt: new Date(),
            filePath: 'path/to/existing/document',
          }, documentId);
      
          mockDocumentRepository.findById = vi.fn().mockResolvedValue(existingDocument);
          mockDocumentRepository.save = vi.fn().mockRejectedValue(new Error('Generic error'));
      
          const result = await documentService.markAsProcessed(documentId.value);
      
          expect(result).toEqual(fail('An error occurred while trying to mark document as processed.'));
        });
      });
});