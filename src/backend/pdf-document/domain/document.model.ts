import { Document } from "./document.aggregate";

export type DocumentModel = {
    id?: string,
    status: string,
    name: string,
    author: string,
    kind: string,
    uploadedAt: Date,
    updatedAt: Date,
}

export function documentMapper(document: Document) {
    const { name, author, kind } = document.metadata || {};
    return {
        id: document.id.value,
        status: document.status,
        name: name || "",
        author : author || "",
        kind: kind || "",
        uploadedAt: document.uploadedAt,
        updatedAt: document.updatedAt,
    };
}