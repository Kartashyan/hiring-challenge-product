import { AggregateRoot } from "src/backend/core/aggregate-root";
import { UID } from "src/backend/core/id";
import { Metadata } from "./metadata.value-object";

export enum DocumentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    PROCESSED = "processed",
}

export interface DocumentProps {
    id?: string;
    metadata: Metadata | null;
    uploadedAt: Date;
    updatedAt: Date;
    filePath: string | null;
}

export class Document extends AggregateRoot<DocumentProps> {
    #status: DocumentStatus;
    constructor(_props: DocumentProps, id?: UID) {
        super(_props, id);
        this.#status = DocumentStatus.PENDING;
    }

    public static create(props: DocumentProps, id?: UID): Document {
        const document = new Document(props, id);
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

    get uploadedAt(): Date {
        return this.props.uploadedAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    get metadata() {
        return this.props.metadata?.toObject() || null;
    }

    get filePath(): string {
        return this.props.filePath || "";
    }

    public updateMetadata(metadata: Metadata): void {
        this.props.metadata = metadata;
        this.addDomainEvent({
            name: "document.metadata.updated",
            occuredAt: new Date(),
            aggregate: this,
        });
    }

    get status(): DocumentStatus {
        return this.#status;
    }

    public updateStatus(status: DocumentStatus): void {
        this.#status = status;
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