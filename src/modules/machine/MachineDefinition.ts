export interface MachineDefinition {
    startFeature: string;
    features: {[featureName: string]: FeatureDefinition};
}

export interface FeatureDefinition {

}

export interface SlotDefinition extends FeatureDefinition {
    rowCount: number;
    reels: string[][];
    paytable: {[symbol: string]: {[count: number]: number}};
    paylines: number[][];
}