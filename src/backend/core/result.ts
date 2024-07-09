type Success<T> = {
    success: true;
    value: T;
};
type Failure<E = string> = {
    success: false;
    reason: E;
};

export type Result<T, E = string> = Success<T> | Failure<E>;

export const ok = <T>(value: T): Success<T> => ({ success: true, value });
export const fail = <E = string>(reason: E): Failure<E> => ({ success: false, reason});