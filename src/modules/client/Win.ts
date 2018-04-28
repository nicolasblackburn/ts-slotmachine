import { WinData } from "./WinData";

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
