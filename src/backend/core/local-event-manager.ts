import EventEmitter from "events";

export class LocalEventManager {
    private static instance: LocalEventManager;
    public eventEmitter: EventEmitter;

    private constructor() {
        this.eventEmitter = new EventEmitter();
    }

    public static getInstance(): LocalEventManager {
        if (!LocalEventManager.instance) {
            LocalEventManager.instance = new LocalEventManager();
        }
        return LocalEventManager.instance;
    }

    public subscribe(event: string, listener: (...args: any[]) => void): void {
        this.eventEmitter.on(event, listener);
    }

    public dispatch(event: string, ...args: any[]): void {
        this.eventEmitter.emit(event, ...args);
    }
}