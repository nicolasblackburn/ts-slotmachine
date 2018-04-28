import { Win } from "./Win";
import { PaylineWinData } from "./PaylineWinData";

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
