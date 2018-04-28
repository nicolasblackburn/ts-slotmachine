import { Client } from "../Client";
import { ForcedPlay } from "../ForcedPlay";
import { Bet } from "../../bet/Bet";
import { InitResponse } from "../InitResponse";
import { PlayResponse } from "../PlayResponse";
import { Rng } from "../../rng/Rng";
import { MachineDefinition } from "../../machine/MachineDefinition";
import { Player } from "../../player/Player";
import { PlayResult } from "../PlayResult";
import { SlotResult } from "../SlotResult";
import { SlotDefinition } from "../../machine/SlotDefinition";

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
                const slotDefinition = <SlotDefinition>this.machineDefinition.base;
                const positions = this.rng.draw(slotDefinition.reels);
                const symbols = this.rng.getSymbols(slotDefinition.reels, slotDefinition.rowCount, positions);
                const response = new PlayResponse(bet, this.player, 0);
                const result = new SlotResult();
                result.totalWin = 0;
                result.positions = positions;
                result.symbols = symbols;
                response.results.push(result);
                resolve(response);
            }, 100);
        });
    }
}