import { Paytable } from "./Paytable";
import { FeatureDefinition } from "./FeatureDefinition";

export interface SlotDefinition extends FeatureDefinition {
    rowCount: number;
    reels: string[][];
    paytable: Paytable;
    paylines: number[][];
    wilds: string[];
}

