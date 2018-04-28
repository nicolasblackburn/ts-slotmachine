import { WinData } from "./WinData";

export interface PaylineWinData extends WinData {
    payline: number[];
    symbol: string;
    count: number;
}
