import { beforeEach, describe, expect, it } from "vitest";
import { DocumentKind } from "./document-kind.value-object";
import { Document, DocumentProps, DocumentStatus } from "./document.aggregate";
import { Metadata } from "./metadata.value-object";

describe("Document", () => {
    let document: Document;
    let props: DocumentProps;

    beforeEach(() => {
        props = {
            metadata: null,
            uploadedAt: new Date(),
            updatedAt: new Date(),
            filePath: null,
        };
        document = Document.create(props);
    });

    it("should create a new document with default status", () => {
        expect(document.status).toBe(DocumentStatus.PENDING);
    });

    it("should update the metadata of the document", () => {
        const metadata: Metadata = new Metadata("Document Name", "Author Name", new DocumentKind("regulation"));
        document.updateMetadata(metadata);
        console.log(document.getMetadata());
        expect(document.getMetadata()).toEqual(metadata);
    });

    it("should update the status of the document", () => {
        const newStatus = DocumentStatus.PROCESSED;
        document.updateStatus(newStatus);
        expect(document.status).toBe(newStatus);
    });

    it("should update the file path of the document", () => {
        const filePath = "/path/to/document.pdf";
        document.updateFilePath(filePath);
        expect(document.getFilePath()).toBe(filePath);
    });
});