import { FeatureDefinition } from "./FeatureDefinition";

export interface MachineDefinition {
    base: FeatureDefinition;
    features: {[featureName: string]: FeatureDefinition};
}