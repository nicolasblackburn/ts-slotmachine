import { BetData } from "./BetData";

export class Bet {
    public credits: number;
    public betsCount: number;

    constructor(betPerLine: number, lineCount) {
        this.credits = betPerLine;
        this.betsCount = lineCount;
    }

    public getTotalBet() {
        return this.credits * this.betsCount;
    }

    public getCredits() {
        return this.credits;
    }

    public serialize() {
        return {
            credits: this.credits,
            betsCount: this.betsCount,
            totalBet: this.getTotalBet()
        };
    }

    public unserialize(data: BetData) {
        this.credits = data.credits;
        this.betsCount = data.betsCount;
    }
}

