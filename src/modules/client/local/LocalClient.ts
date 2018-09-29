import { Client } from "../Client";
import { Bet } from "../../bet/Bet";
import { InitResponse } from "../InitResponse";
import { PlayResponse } from "../PlayResponse";
import { MachineDefinition } from "../../machine/MachineDefinition";
import { Player } from "../../player/Player";
import { SlotDefinition } from "../../machine/SlotDefinition";
import { SlotFeature } from "./features/SlotFeature";
import { EventEmitter } from "events";

export class LocalClient implements Client {
    public events: EventEmitter;
    protected machineDefinition: MachineDefinition;
    protected player: Player;
    protected slotFeature: SlotFeature;

    constructor(machineDefinition: MachineDefinition) {
        this.events = new EventEmitter();
        this.events.setMaxListeners(100);
        this.machineDefinition = machineDefinition;
        this.player = new Player(100000000, 'en_ca', 'CAD');
        this.slotFeature = new SlotFeature(<SlotDefinition>this.machineDefinition.base);
    }

    public init(): Promise<InitResponse> {
        return new Promise((resolve) => {
            resolve(new InitResponse);
        });
    }

    public play(bet: Bet) {
        return new Promise<PlayResponse>((resolve) => {
            setTimeout(() => {
                const response = new PlayResponse(bet, this.player, 0);
                this.slotFeature.execute(response);
                resolve(response);
            }, 100);
        });
    }
}