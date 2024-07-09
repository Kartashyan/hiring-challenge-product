import randomUUID from "./crypto";

interface ID {
    value: string;
    isNew: boolean;
}

export class UID implements ID {
    public readonly value: string;
    public readonly isNew: boolean;

    constructor(value?: string) {
        if (typeof value == 'undefined') {
            this.value = randomUUID();
            this.isNew = true;
        } else {
            this.value = typeof value === 'string' ? value : String(value);
            this.isNew = false;
        }
    }

    public equals(id?: ID): boolean {
        if (id === null || id === undefined) {
            return false;
        }
        if (id.value === null || id.value === undefined) {
            return false;
        }
        return this.value === id.value;
    }
}