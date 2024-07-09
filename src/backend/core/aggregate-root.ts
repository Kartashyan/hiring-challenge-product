
import { DomainEvent } from "./domain-event";
import { Entity } from "./entity";
import { UID } from "./id";
import { LocalEventManager } from "./local-event-manager";

export class AggregateRoot<T> extends Entity<T> {
    protected _domainEvents: DomainEvent<this>[];
    constructor(_props: T, id?: UID) {
        super(_props, id);
        this._domainEvents = [];
    }

    public addDomainEvent(event: DomainEvent<this>): void {
        this._domainEvents.push(event);
    }

    get domainEvents(): DomainEvent<AggregateRoot<T>>[] {
        return this._domainEvents;
    }

    dispatchDomainEvents(emitter: LocalEventManager = LocalEventManager.getInstance()): void {
        this._domainEvents.forEach((event) => {
            emitter.dispatch(event.name, event);
        });
        this._domainEvents = [];
    }
}