export interface ProcessingAPI {
    processDocument(documentId: string): Promise<void>;
}