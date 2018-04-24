import { StateInterface } from "./State";

export enum StateManagerEvent {
    Enter = 'StateManagerEvent.Enter',
    Exit = 'StateManagerEvent.Exit',
}

export class StateManager<T extends StateInterface> {
    public events: PIXI.utils.EventEmitter;
    protected states: Map<string, T> = new Map();
    protected pCurrent: string;

    constructor() {
        this.events = new PIXI.utils.EventEmitter();
    }

    public add(key: string, state: T) {
        this.states.set(key, state);
    }

    public clear() {
        this.states.clear();
    }

    public entries() {
        return this.states.entries();
    }

    public forEach(callback: (...args: any[]) => void, ...args: any[]) {
        this.states.forEach.apply(null, [callback, ...args]);
    }

    public set(key: string, ...args: any[]) {
        if (!this.states.has(key)) {
            throw new Error("State `" + key + "` doesn't exists");
        }
        if (this.pCurrent !== key) {
            let previous = this.key();
            if (this.current()) {
                this.current().onExit.apply(this.current(), [key, ...args]);
                this.events.emit(StateManagerEvent.Exit, previous, key, ...args);
            }
            this.pCurrent = key;
            if (this.current()) {
                this.current().onEnter.apply(this.current(), [previous, ...args]);
                this.events.emit(StateManagerEvent.Enter, previous, key, ...args);
            }
        }
    }

    public keys() {
        return this.states.keys();
    }

    public values() {
        return this.states.values();
    }

    public get(key: string) {
        return this.states.get(key);
    }

    public current() {
        return this.states.get(this.pCurrent);
    }

    public key() {
        return this.pCurrent;
    }

    public has(key: string) {
        return this.states.has(key);
    }

    public remove(state: string) {
        this.states.delete(state as string);
    }

    public [Symbol.iterator]() {
        return this.states[Symbol.iterator]();
    }
}
