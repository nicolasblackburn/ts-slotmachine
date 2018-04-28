import { FeatureDefinition } from "./FeatureDefinition";

export interface PickerDefinition extends FeatureDefinition {
    picks: string[][];
    weights: number[][];
    payouts: number[][];
}
