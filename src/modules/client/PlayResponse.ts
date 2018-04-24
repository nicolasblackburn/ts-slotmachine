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

    public serialize() {
        return {
            bet: Object.assign({}, this.bet),
            player: Object.assign({}, this.player),
            results: this.results.map(result => result.serialize())
        }
    }

    public unserialize(data: PlayResponseData) {
        this.bet = Object.assign({}, data.bet);
        this.player = Object.assign({}, data.player);
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

export interface PlayResponseData {
    bet: BetData;
    player: PlayerData;
    results: PlayResultData[];
}

export class PlayResult {
    public totalWin: number;

    public serialize() {
        return {
            totalWin: this.totalWin
        }
    }

    public unserialize(data: PlayResultData) {
        this.totalWin = data.totalWin;
    }
}

export interface PlayResultData {
    totalWin: number;
    className: string;
}

export class SlotResult extends PlayResult {
    public positions: number[];
    public symbols: string[][];
    public wins: Win[];

    public serialize() {
        const data = super.serialize();
        Object.assign(data, {
            positions: this.positions.slice(),
            symbols: this.symbols.map(column => column.slice()),
            wins: this.wins.map(win => win.serialize())
        });
        return data;
    }

    public unserialize(data: SlotResultData) {
        this.positions = data.positions.slice();
        this.symbols = data.symbols.map(column => column.slice());
        this.wins = data.wins.map(winData => {
            return this.unserializeWin(winData);
        });
    }

    protected unserializeWin(winData: WinData) {
        if (winData.className === 'Win') {
            const win = new Win();
            win.deserialize(winData);
            return win;
        } else if  (winData.className === 'PaylineWin') {
            const win = new PaylineWin();
            win.deserialize(winData as PaylineWinData);
            return win;
        }
    }
}

export interface SlotResultData extends PlayResultData {
    positions: number[];
    symbols: string[][];
    wins: WinData[];
}

export class Win {
    public winAmount: number;

    public serialize() {
        return {
            winAmount: this.winAmount
        };
    }

    public deserialize(data: WinData) {
        this.winAmount = data.winAmount;
    }
}

export interface WinData {
    winAmount: number;
    className: string;
}

export class PaylineWin extends Win {
    public payline: number[];
    public symbol: string;
    public count: number;

    public serialize() {
        const data = super.serialize();
        Object.assign(data, {
            payline: this.payline.slice(),
            symbol: this.symbol,
            count: this.count
        });
        return data;
    }

    public deserialize(data: PaylineWinData) {
        this.payline = data.payline.slice();
        this.symbol = data.symbol;
        this.count = data.count;
    }
}

export interface PaylineWinData extends WinData {
    payline: number[];
    symbol: string;
    count: number;
}