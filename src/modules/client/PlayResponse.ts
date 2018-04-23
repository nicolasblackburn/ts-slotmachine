import { Bet, BetData } from "../bet/Bet";
import { Player, PlayerData } from "../player/Player";

export class PlayResponse {
    public bet: BetData;
    public player: PlayerData;
    public results: PlayResult[];

    constructor(bet: BetData, player: PlayerData) {
        this.bet = bet;
        this.player = player;
    }
}

export class PlayResult {
    public totalWin: number;
}

export class SlotResult extends PlayResult {
    public positions: number[];
    public symbols: string[][];
    public wins: Win[];
}

export class Win {
    public winAmount: number;
}

export class PaylineWin extends Win {
    public payline: number[];
    public symbol: string;
    public count: number;
}