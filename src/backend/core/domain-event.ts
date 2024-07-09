export interface DomainEvent<T> {
    name: string;
    occuredAt: Date;
    aggregate: T;
}