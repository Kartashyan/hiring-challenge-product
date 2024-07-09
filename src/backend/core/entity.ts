import { UID } from "./id";

export class Entity<T> {
    protected readonly _id: UID
    constructor(protected props: T, id?: UID) {
        this.props = props;
        this._id = id ? id : new UID();
    }

    get id(): UID {
        return this._id;
    }

    public equals(entity?: Entity<T>): boolean {
        if (entity === null || entity === undefined) {
            return false;
        }
        if (entity.id === null || entity.id === undefined) {
            return false;
        }

        if (typeof this.props !== 'object' || typeof entity.props !== 'object') {
            return false;
        }

        return this.id.equals(entity.id);
    }
}