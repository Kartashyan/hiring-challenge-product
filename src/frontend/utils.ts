import { DocumentModel } from "src/backend/pdf-document/application/document.dto";

export const flatDocument = (document: DocumentModel) => {
    const { metadata, ...rest } = document;
    return {
        ...metadata,
        ...rest,
    };
}

export type FlatDocumentModel = ReturnType<typeof flatDocument>;