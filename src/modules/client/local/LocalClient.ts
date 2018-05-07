import { Client } from "../Client";
import { ForcedPlay } from "../ForcedPlay";
import { Bet } from "../../bet/Bet";
import { InitResponse } from "../InitResponse";
import { PlayResponse } from "../PlayResponse";
import { MachineDefinition } from "../../machine/MachineDefinition";
import { Player } from "../../player/Player";
import { PlayResult } from "../PlayResult";
import { SlotResult } from "../SlotResult";
import { SlotDefinition } from "../../machine/SlotDefinition";
import { Paytable } from "../../machine/Paytable";
import { SlotFeature } from "./features/SlotFeature";

export class LocalClient implements Client {
    public events: PIXI.utils.EventEmitter;
    protected machineDefinition: MachineDefinition;
    protected player: Player;
    protected slotFeature: SlotFeature;

    constructor(machineDefinition: MachineDefinition) {
        this.events = new PIXI.utils.EventEmitter();
        this.machineDefinition = machineDefinition;
        this.player = new Player(100000000, 'en_ca', 'CAD');
        this.slotFeature = new SlotFeature(<SlotDefinition>this.machineDefinition.base);
    }

    public init(): Promise<InitResponse> {
        return new Promise((resolve, reject) => {
            resolve(new InitResponse);
        });
    }

    public play(bet: Bet, forcedPlay: ForcedPlay) {
        return new Promise<PlayResponse>((resolve, reject) => {
            setTimeout(() => {
                const response = new PlayResponse(bet, this.player, 0);
                this.slotFeature.execute(response);
                resolve(response);
            }, 100);
        });
    }
}