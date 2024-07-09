import { ProcessingAPI } from "../application/processing-api.port";

export class MockProcessingAPI implements ProcessingAPI {
    public async processDocument(documentId: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}