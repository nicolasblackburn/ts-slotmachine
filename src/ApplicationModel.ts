import { PlayResponse, Win } from "./modules/client/PlayResponse";
import { Bet } from "./modules/bet/Bet";

export enum ApplicationModelEvent {
    Changed = 'ApplicationModelEvent.Changed'
}

export class ApplicationModel {
    public events: PIXI.utils.EventEmitter;
    public canSpin: boolean = true;
    public playResponse: PlayResponse;
    public bet: Bet;
    public wins: Win[] = [];

    constructor() {
        this.events = new PIXI.utils.EventEmitter;
    }

    public notifyObservers() {
        this.events.emit(ApplicationModelEvent.Changed);
    }
}