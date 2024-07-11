import { AggregateRoot } from "src/backend/core/aggregate-root";
import { UID } from "src/backend/core/id";
import { Metadata } from "./metadata.value-object";
import { DocumentStatus } from "./document-status.value-object";

export interface DocumentProps {
    id?: string;
    metadata: Metadata | null;
    uploadedAt: Date;
    updatedAt: Date;
    filePath: string | null;
}

export class Document extends AggregateRoot<DocumentProps> {
    #status: string;
    constructor(_props: DocumentProps, id?: UID, status?: string) {
        super(_props, id);
        this.#status = status ? new DocumentStatus(status).value : DocumentStatus.INITIAL;
    }

    public static create(props: DocumentProps, id?: UID, status?: string): Document {
        const document = new Document(props, id, status);
        const isNew = !id;
        if (isNew) {
            document.addDomainEvent({
                name: "document.created",
                occuredAt: new Date(),
                aggregate: document,
            });
        }
        return document;
    }

    get uploadedAt(): string {
        return this.props.uploadedAt.toISOString();
    }

    get updatedAt(): string {
        return this.props.updatedAt.toISOString();
    }

    get filePath(): string {
        return this.props.filePath || "";
    }

    get status(): string {
        return this.#status;
    }

    get metadata(): {[key: string]: string} | null {
        return this.props.metadata?.toObject() || null;
    }

    public updateMetadata(metadata: Metadata): void {
        this.props.metadata = metadata;
        this.addDomainEvent({
            name: "document.metadata.updated",
            occuredAt: new Date(),
            aggregate: this,
        });
    }

    public updateStatus(status: string): void {
        this.#status = new DocumentStatus(status).value;
        this.addDomainEvent({
            name: "document.status.updated",
            occuredAt: new Date(),
            aggregate: this,
        });
    }

    public updateFilePath(filePath: string): void {
        this.props.filePath = filePath;
        this.addDomainEvent({
            name: "document.filepath.updated",
            occuredAt: new Date(),
            aggregate: this,
        });
    }

    public getFilePath(): string | null {
        return this.props.filePath;
    }

    public getMetadata(): Metadata | null {
        return this.props.metadata;
    }
}