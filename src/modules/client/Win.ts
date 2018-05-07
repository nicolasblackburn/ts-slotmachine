import { WinData } from "./WinData";

export class Win {
    public amount: number;

    constructor(amount: number = 0) {
        this.amount = amount;
    }

    public serialize() {
        return {
            amount: this.amount
        };
    }

    public deserialize(data: WinData) {
        this.amount = data.amount;
    }
}
