import { Bet } from "../bet/Bet";
import { Player } from "../player/Player";
import { PlayResult } from "./PlayResult";
import { PlayResponseData } from "./PlayResponseData";
import { PlayResultData } from "./PlayResultData";
import { SlotResult } from "./SlotResult";
import { SlotResultData } from "./SlotResultData";

export class PlayResponse {
    public bet: Bet;
    public player: Player;
    public totalWin: number = 0;
    public results: PlayResult[] = [];
    public features: string[] = [];

    constructor(bet: Bet, player: Player, totalWin: number) {
        this.bet = bet;
        this.player = player;
        this.totalWin = totalWin;
    }

    public serialize() {
        return {
            bet: this.bet.serialize(),
            player: this.player.serialize(),
            totalWin: this.totalWin,
            features: this.features.slice(),
            results: this.results.map(result => result.serialize())
        }
    }

    public unserialize(data: PlayResponseData) {
        this.bet = new Bet(0, 0);
        this.bet.unserialize(data.bet);
        this.player = new Player(0, '', '');
        this.player.unserialize(data.player);
        this.totalWin = data.totalWin;
        this.features = data.features.slice();
        this.results = data.results.map(resultData => {
            return this.unserializePlayResult(resultData);
        });
    }

    protected unserializePlayResult(resultData: PlayResultData) {
        if (resultData.className === 'PlayResult') {
            const result = new PlayResult();
            result.unserialize(resultData);
            return result;
        } else if  (resultData.className === 'SlotResult') {
            const result = new SlotResult();
            result.unserialize(resultData as SlotResultData);
            return result;
        }
    }
}