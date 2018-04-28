import { BetData } from "../bet/BetData";
import { PlayerData } from "../player/PlayerData";
import { PlayResultData } from "./PlayResultData";

export interface PlayResponseData {
    bet: BetData;
    player: PlayerData;
    totalWin: number;
    results: PlayResultData[];
    features: string[];
}