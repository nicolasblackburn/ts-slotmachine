import { BetData } from "../bet/Bet";
import { PlayerData } from "../player/Player";
import { PlayResultData } from "./PlayResultData";

export interface PlayResponseData {
    bet: BetData;
    player: PlayerData;
    totalWin: number;
    results: PlayResultData[];
    features: string[];
}