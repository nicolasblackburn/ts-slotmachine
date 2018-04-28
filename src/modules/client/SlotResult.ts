import { PlayResult } from "./PlayResult";
import { SlotResultData } from "./SlotResultData";

export class SlotResult extends PlayResult {
    public positions: number[];
    public symbols: string[][];

    public serialize() {
        const data = super.serialize();
        Object.assign(data, {
            positions: this.positions.slice(),
            symbols: this.symbols.map(column => column.slice())
        });
        return data;
    }

    public unserialize(data: SlotResultData) {
        this.positions = data.positions.slice();
        this.symbols = data.symbols.map(column => column.slice());
    }
}
