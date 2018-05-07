import { SlotDefinition } from "../../../machine/SlotDefinition";
import { PlayResponse } from "../../PlayResponse";
import { SlotResult } from "../../SlotResult";
import { Paytable } from "../../../machine/Paytable";
import { PaylineWin } from "../../PaylineWin";

export class SlotFeature {
    protected definition: SlotDefinition;

    constructor(definition: SlotDefinition) {
        this.definition = definition;
    }

    public execute(response: PlayResponse) {
        const positions = this.draw(this.definition.reels);
        const symbols = this.getSymbols(this.definition.reels, this.definition.rowCount, positions);
        const wins = this.getPaylinesWins(this.definition.paylines, this.definition.wilds, this.definition.wildInPaytable, this.definition.paytable, symbols);
        const totalWin = wins.reduce((sum, win) => sum + win.amount, 0);
        const result = new SlotResult();
        result.totalWin = totalWin;
        result.positions = positions;
        result.symbols = symbols;
        result.wins = wins;
        response.results.push(result);
        response.totalWin += result.totalWin;
    }

    protected draw(reels: string[][]) {
        return reels
            .map(reel => Math.floor(Math.random() * reel.length));
    }

    protected getSymbols(reels: string[][], rowCount: number, positions: number[]) {
        return positions.map((position, reelIndex) => {
            const column = reels[reelIndex].slice(position, position + rowCount);
            if (column.length < rowCount) {
                return column.concat(reels[reelIndex].slice(0, rowCount - column.length));
            } else {
                return column;
            }
        });
    }

    protected getPaylinesWins(paylines: number[][], wilds: string[], wildInPaytable: string, paytable: Paytable, symbols: string[][]) {
        let wins = [];
        for (const payline of paylines) {
            let i = 0;
            let wildCount = 0;
            let count = 0;
            let isWild = true;
            let symbol = null;
            for (; i < payline.length && i < symbols.length; i++) {
                if (payline[i] >= symbols.length) {
                    break;
                }
                const symbolToCompare = symbols[i][payline[i]];
                if (symbol === null && wilds.includes(symbolToCompare)) {
                    wildCount++;
                    count++
                } else if (symbol === null) {
                    symbol = symbolToCompare;
                    count++;
                    isWild = false;
                } else if (symbol === symbolToCompare || wilds.includes(symbolToCompare)) {
                    count++;
                } else {
                    break;
                }
            }
    
            if (count !== 0) {
                let wildAmount = 0;
                let amount = 0;
                if (isWild && paytable[wildInPaytable] && paytable[wildInPaytable][wildCount]) {
                    wildAmount = paytable[wildInPaytable][wildCount];
                }
                if (paytable[symbol] && paytable[symbol][count]) {
                    amount = paytable[symbol][count];
                }
                if (wildAmount >= amount && wildAmount > 0) {
                    wins.push(new PaylineWin(wildAmount, wildInPaytable, wildCount, payline));
                } else if (amount > 0) {
                    wins.push(new PaylineWin(amount, symbol, count, payline));
                }
            }
        }
        return wins;
    }
}