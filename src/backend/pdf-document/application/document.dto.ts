export type MetadataModel = {
    name: string | null,
    author: string | null,
    kind: string,
}

export type DocumentModel = {
    id: string,
    status: string,
    uploadedAt: string,
    updatedAt: string,
    filePath: string | null,
    metadata: MetadataModel | null,
}


export type UploadDocumentDto = {
    file: Buffer;
}