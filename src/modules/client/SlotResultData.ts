import { PlayResultData } from "./PlayResultData";

export interface SlotResultData extends PlayResultData {
    positions: number[];
    symbols: string[][];
}