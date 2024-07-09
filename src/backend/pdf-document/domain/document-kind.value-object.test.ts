import { describe, expect, it } from "vitest";
import { DocumentKind } from "./document-kind.value-object";
import { DomainError } from "src/backend/core/domain-error";

describe("DocumentKind", () => {
    it("should create a new DocumentKind instance with a valid kind", () => {
        const validKind = "ISO norm";
        const documentKind = new DocumentKind(validKind);
        expect(documentKind.value).toBe(validKind);
    });

    it("should throw a DomainError when creating a new DocumentKind instance with an invalid kind", () => {
        const invalidKind = "invalid kind";
        expect(() => new DocumentKind(invalidKind)).toThrow(DomainError);
    });

    it("should return true when comparing two DocumentKind instances with the same kind", () => {
        const kind = "ISO norm";
        const documentKind1 = new DocumentKind(kind);
        const documentKind2 = new DocumentKind(kind);
        expect(documentKind1.equals(documentKind2)).toBe(true);
    });

    it("should return false when comparing two DocumentKind instances with different kinds", () => {
        const kind1 = "ISO norm";
        const kind2 = "regulation";
        const documentKind1 = new DocumentKind(kind1);
        const documentKind2 = new DocumentKind(kind2);
        expect(documentKind1.equals(documentKind2)).toBe(false);
    });
});