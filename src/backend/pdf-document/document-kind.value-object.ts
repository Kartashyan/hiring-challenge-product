import { DomainError } from "src/backend/core/domain-error";
import { ValueObject } from "src/backend/core/value-object";


export class DocumentKind extends ValueObject<string> {
    private readonly kind: string;

    private static readonly VALID_KINDS = [
        "ISO norm",
        "regulation",
        "internal documentation",
    ];

    constructor(kind: string) {
        super(kind);
        if (!DocumentKind.VALID_KINDS.includes(kind)) {
            throw new DomainError(`Invalid document kind: ${kind}, valid kinds are: ${DocumentKind.VALID_KINDS.join(", ")}`);
        }
        this.kind = kind;
    }

    get value() {
        return this.kind;
    }

    equals(other: DocumentKind): boolean {
        return this.kind === other.kind;
    }
}