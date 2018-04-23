import { Client } from "../Client";
import { ForcedPlay } from "../ForcedPlay";
import { Bet } from "../../bet/Bet";
import { InitResponse } from "../InitResponse";
import { PlayResponse } from "../PlayResponse";
import { Rng } from "../../rng/Rng";

export class LocalClient implements Client {
    protected rng: Rng;

    constructor() {
        this.rng = new Rng();
        console.log();
    }

    public init(): Promise<InitResponse> {
        return null;
    }

    public play(bet: Bet, forcedPlay: ForcedPlay): Promise<PlayResponse> {
        return null;
    }
}