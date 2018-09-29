/**
 * This module provides operators to combine events together allowing to create more complex events out of elementary
 * events. An event is encapsulated into a signal. Signal can emit event and can have handlers attached to or 
 * detached from them. Two signals can be combined together with one of the following operators:
 *  
 * - The `add` operator creates a new signal that emits only when the two elementary signals have emitted. 
 * - The `or` operator creates a new signal that emits when either of the two elementary signals have emitted.
 * - The `seq` operator creates a new signal that emits only when elementary signal B have emitted after 
 *   the elementary signal A.
 * 
 * The module also provides functions to detach the listeners attached to the composite and elementary signals.
 * 
 * The module is parameterizable in such a way that the implementation for the event emitter can be provided on
 * creation of the module.
 */
module event {
    /**
     * The interface that needs to be implemented by an event emitter.
     */
    export interface Emitter {
        emit(event: string | symbol, ...args: any[]): boolean;
    
        off(event: string | symbol, fn?: Function, context?: any, once?: boolean): this;
    
        on(event: string | symbol, fn: Function, context?: any): this;
    
        once(event: string | symbol, fn: Function, context?: any): this;
    }
    
    /**
     * Encapsulate an event into a single object.
     */
    export class Signal {
        protected source: Emitter;
        protected event: string | symbol;
    
        constructor(source: Emitter, event: string | symbol) {
            this.source = source;
            this.event = event;
        }
    
        public emit(...args: any[]) {
            return this.source.emit(this.event, args);
        }
    
        public off(fn?: Function, context?: any, once?: boolean) {
            this.source.off(this.event, fn, context, once);
            return this;
        }
    
        public on(fn: Function, context?: any) {
            this.source.on(this.event, fn, context);
            return this;
        }
    
        public once(fn: Function, context?: any) {
            this.source.once(this.event, fn, context);
            return this;
        }
    }
    
    enum Op {
        And,
        Or,
        Seq
    }
    
    /**
     * Memory tables to keep track of the attached handlers.
     */
    const MEMO_AND: Map<Signal, Map<Signal, [Signal, Function, Function]>> = new Map();
    const MEMO_OR: Map<Signal, Map<Signal, [Signal, Function, Function]>> = new Map(); 
    const MEMO_SEQ: Map<Signal, Map<Signal, [Signal, Function, Function]>> = new Map();
    const MEMO_REV: Map<Signal, [Op, Signal, Signal]> = new Map();
    
    /**
     * Creates a composite signal from to elementary signals. The new signal will only emit once both elementary 
     * signals have emitted.
     * @param createEmitter 
     * @param signalA 
     * @param signalB 
     */
    export function and(createEmitter: () => Emitter, signalA: Signal, signalB: Signal) {
        if (!signalA && !signalB) {
            return signalA;
        } else if (!signalA) {
            return signalB;
        } else if (!signalB) {
            return signalA;
        } else if (MEMO_AND.has(signalA) && MEMO_AND.get(signalA).has(signalB)) {
            const [signal] = MEMO_AND.get(signalA).get(signalB);
            return signal;
        } else {
            const signal = new Signal(createEmitter(), Symbol());
            let argsA;
            let argsB;
            let handlerA = (...args: any[]) => {
                if (!argsA) {
                    argsA = args;
                }
                if (argsB) {
                    signal.emit(argsA, argsB);
                    argsA = null;
                    argsB = null;
                }
            };
            let handlerB = (...args: any[]) => {
                if (!argsB) {
                    argsB = args;
                }
                if (argsA) {
                    signal.emit(argsA, argsB);
                    argsA = null;
                    argsB = null;
                }
            };
            signalA.on(handlerA);
            signalB.on(handlerB);
            if (!MEMO_AND.has(signalA)) {
                MEMO_AND.set(signalA, new Map());
            }
            MEMO_AND.get(signalA).set(signalB, [signal, handlerA, handlerB]);
            MEMO_REV.set(signal, [Op.And, signalA, signalB]);
            return signal;
        }
    }
    
    /**
     * Creates a composite signal from to elementary signals. The new signal will if any of the elementary 
     * signals have emitted.
     * @param createEmitter 
     * @param signalA 
     * @param signalB 
     */
    export function or(createEmitter: () => Emitter, signalA: Signal, signalB: Signal) {
        if (!signalA && !signalB) {
            return signalA;
        } else if (!signalA) {
            return signalB;
        } else if (!signalB) {
            return signalA;
        } else if (MEMO_OR.has(signalA) && MEMO_OR.get(signalA).has(signalB)) {
            const [signal] = MEMO_OR.get(signalA).get(signalB);
            return signal;
        } else {
            const signal = new Signal(createEmitter(), Symbol());
            let handlerA = (...args: any[]) => {
                signal.emit(args, []);
            };
            let handlerB = (...args: any[]) => {
                signal.emit([], args);
            };
            signalA.on(handlerA);
            signalB.on(handlerB);
            if (!MEMO_OR.has(signalA)) {
                MEMO_OR.set(signalA, new Map());
            }
            MEMO_OR.get(signalA).set(signalB, [signal, handlerA, handlerB]);
            MEMO_REV.set(signal, [Op.Or, signalA, signalB]);
            return signal;
        }
    }
    
    /**
     * Creates a composite signal from to elementary signals. The new signal will only emit once both elementary 
     * signals have emitted one after the other, signal B following signal A.
     * @param createEmitter 
     * @param signalA 
     * @param signalB 
     */
    export function seq(createEmitter: () => Emitter, signalA: Signal, signalB: Signal) {
        if (!signalA && !signalB) {
            return signalA;
        } else if (!signalA) {
            return signalB;
        } else if (!signalB) {
            return signalA;
        } else if (MEMO_SEQ.has(signalA) && MEMO_SEQ.get(signalA).has(signalB)) {
            const [signal] = MEMO_SEQ.get(signalA).get(signalB);
            return signal;
        } else {
            const signal = new Signal(createEmitter(), Symbol());
            let argsA;
            let handlerA = (...args: any[]) => {
                argsA = args;
                signalA.off(handlerA);
                signalB.on(handlerB);
            };
            let handlerB = (...args: any[]) => {
                signal.emit(argsA, args);
                signalB.off(handlerB);
                signalA.on(handlerA);
            };
            signalA.on(handlerA);
            if (!MEMO_SEQ.has(signalA)) {
                MEMO_SEQ.set(signalA, new Map());
            }
            MEMO_SEQ.get(signalA).set(signalB, [signal, handlerA, handlerB]);
            MEMO_REV.set(signal, [Op.Seq, signalA, signalB]);
            return signal;
        }
    }
    
    /**
     * Takes in parameter a composite signal and free the base signals composing it, removing handlers and deleting
     * them from the signals table.
     * @param signal 
     */
    export function free(signal: Signal) {
        if (MEMO_REV.has(signal)) {
            const [type, signalA, signalB] = MEMO_REV.get(signal);
            MEMO_REV.delete(signal);
            if (type === Op.And) {
                freeAnd(signalA, signalB);
            } else if (type === Op.Or) {
                freeOr(signalA, signalB);
            } else if (type === Op.Seq) {
                freeSeq(signalA, signalB);
            }
            free(signalB);
            free(signalA);
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * If an `and` pair exists in memory for signal A and signal B, it detach handlers from them and free them
     * from the signals table.
     * @param signalA 
     * @param signalB 
     */
    export function freeAnd(signalA: Signal, signalB: Signal) {
        if (MEMO_AND.has(signalA) && MEMO_AND.get(signalA).has(signalB)) {
            const [_, handlerA, handlerB] = MEMO_AND.get(signalA).get(signalB);
            signalA.off(handlerA);
            signalB.off(handlerB);
            MEMO_AND.get(signalA).delete(signalB);
            if (MEMO_AND.get(signalA).size === 0) {
                MEMO_AND.delete(signalA);
            }
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * If an `or` pair exists in memory for signal A and signal B, it detach handlers from them and free them
     * from the signals table.
     * @param signalA 
     * @param signalB 
     */
    export function freeOr(signalA: Signal, signalB: Signal) {
        if (MEMO_OR.has(signalA) && MEMO_OR.get(signalA).has(signalB)) {
            const [_, handlerA, handlerB] = MEMO_OR.get(signalA).get(signalB);
            signalA.off(handlerA);
            signalB.off(handlerB);
            MEMO_OR.get(signalA).delete(signalB);
            if (MEMO_OR.get(signalA).size === 0) {
                MEMO_OR.delete(signalA);
            }
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * If a `seq` pair exists in memory for signal A and signal B, it detach handlers from them and free them
     * from the events table.
     * @param signalA 
     * @param signalB 
     */
    export function freeSeq(signalA: Signal, signalB: Signal) {
        if (MEMO_SEQ.has(signalA) && MEMO_SEQ.get(signalA).has(signalB)) {
            const [_, handlerA, handlerB] = MEMO_SEQ.get(signalA).get(signalB);
            signalA.off(handlerA);
            signalB.off(handlerB);
            MEMO_SEQ.get(signalA).delete(signalB);
            if (MEMO_SEQ.get(signalA).size === 0) {
                MEMO_SEQ.delete(signalA);
            }
            return true;
        } else {
            return false;
        }
    }
}

/**
 * Instantiate the module. A function that returns a new emitter has to be provided in parameter. This allows the 
 * module to be flexible and its user to choose which event implementation he wants to support.
 * @param createEmitter 
 */
export function createModule(createEmitter: () => event.Emitter) {
    const {and, or, seq} = event;
    return Object.assign(event, {
        create: () => new event.Signal(createEmitter(), Symbol()),
        and: (signalA, signalB) => {
            return and(createEmitter, signalA, signalB);
        },
        or: (signalA, signalB) => {
            return or(createEmitter, signalA, signalB);
        },
        seq: (signalA, signalB) => {
            return seq(createEmitter, signalA, signalB);
        }
    });
}