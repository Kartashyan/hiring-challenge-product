import { DomainError } from "src/backend/core/domain-error";
import { ValueObject } from "src/backend/core/value-object";

export class DocumentStatus extends ValueObject<string> {
    private readonly status: string;

    static INITIAL = "initial";
    static PENDING = "pending";
    static PROCESSING = "processing";
    static PROCESSED = "processed";

    private static readonly VALID_STATUSES = [
        DocumentStatus.INITIAL,
        DocumentStatus.PENDING,
        DocumentStatus.PROCESSING,
        DocumentStatus.PROCESSED,
    ];

    constructor(status: string) {
        super(status);
        if (!DocumentStatus.VALID_STATUSES.includes(status)) {
            throw new DomainError(`Invalid document status: ${status}, valid statuses are: ${DocumentStatus.VALID_STATUSES.join(", ")}`);
        }
        this.status = status;
    }

    get value() {
        return this.status;
    }
}