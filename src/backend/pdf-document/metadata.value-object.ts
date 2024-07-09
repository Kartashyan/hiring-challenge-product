import { ValueObject } from "src/backend/core/value-object";
import { DocumentKind } from "./document-kind.value-object";


export type MetadataProps = {
  name: string;
  author: string;
  kind: DocumentKind;
}

export class Metadata extends ValueObject<MetadataProps> {
  constructor(
    private readonly name: string, // Will becaome a value object in the future whne we need a validation
    private readonly author: string,
    private readonly kind: DocumentKind
  ) {
    super({ name, author, kind });
  }

  toObject() {
    return {
      name: this.name,
      author: this.author,
      kind: String(this.kind),
    }
  }
}