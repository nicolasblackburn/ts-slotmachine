import { BetData } from "./BetData";

export class Bet {
    public betPerLine: number;
    public lineCount: number;

    constructor(betPerLine: number, lineCount) {
        this.betPerLine = betPerLine;
        this.lineCount = lineCount;
    }

    public getTotalBet() {
        return this.betPerLine * this.lineCount;
    }

    public getLineBet(lineId: number) {
        return this.betPerLine;
    }

    public serialize() {
        return {
            betPerLine: this.betPerLine,
            lineCount: this.lineCount,
            totalBet: this.getTotalBet()
        };
    }

    public unserialize(data: BetData) {
        this.betPerLine = data.betPerLine;
        this.lineCount = data.lineCount;
    }
}

