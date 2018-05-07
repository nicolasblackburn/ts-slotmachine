import { Win } from "./Win";
import { PaylineWinData } from "./PaylineWinData";

export class PaylineWin extends Win {
    public payline: number[];
    public symbol: string;
    public count: number;

    constructor(amount: number = 0, symbol: string = null, count: number = 0, payline: number[] = []) {
        super(amount);
        this.symbol = symbol;
        this.count = count;
        this.payline = payline;
    }

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
