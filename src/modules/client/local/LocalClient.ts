import { Client } from "../Client";
import { ForcedPlay } from "../ForcedPlay";
import { Bet } from "../../bet/Bet";
import { InitResponse } from "../InitResponse";
import { PlayResponse } from "../PlayResponse";
import { Rng } from "../../rng/Rng";
import { MachineDefinition, SlotDefinition } from "../../machine/MachineDefinition";
import { Player } from "../../player/Player";

export class LocalClient implements Client {
    public events: PIXI.utils.EventEmitter;
    protected rng: Rng;
    protected machineDefinition: MachineDefinition;
    protected player: Player;

    constructor(machineDefinition: MachineDefinition) {
        this.events = new PIXI.utils.EventEmitter();
        this.machineDefinition = machineDefinition;
        this.rng = new Rng();
        this.player = new Player(100000000, 'en_ca', 'CAD');
    }

    public init(): Promise<InitResponse> {
        return new Promise((resolve, reject) => {
            resolve(new InitResponse);
        });
    }

    public play(bet: Bet, forcedPlay: ForcedPlay) {
        return new Promise<PlayResponse>((resolve, reject) => {
            setTimeout(() => {
                const slotDefinition = this.machineDefinition.base;
                const positions = this.rng.draw(slotDefinition.reels);
                const originalSymbols = this.rng.getSymbols(slotDefinition.reels, slotDefinition.rowCount, positions);
                const response = new PlayResponse(bet.serialize(), this.player.serialize(), 0);
                resolve(response);
            }, 100);
        });
    }
}