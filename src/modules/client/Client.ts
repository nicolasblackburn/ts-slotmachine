import { Bet } from "../bet/Bet";
import { ForcedPlay } from "./ForcedPlay";
import { InitResponse } from "./InitResponse";
import { PlayResponse } from "./PlayResponse";

export interface Client {
    init(): Promise<InitResponse>;
    play(bet: Bet, forcedPlay?: ForcedPlay): Promise<PlayResponse>;
}