export interface MachineDefinition {
    base: SlotDefinition;
    features: {[featureName: string]: FeatureDefinition};
}

export interface FeatureDefinition {
    name: string;
    type: string;
}

export interface SlotDefinition extends FeatureDefinition {
    rowCount: number;
    reels: string[][];
    paytable: {[symbol: string]: {[count: number]: number}};
    paylines: number[][];
}