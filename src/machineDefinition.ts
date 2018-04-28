import { MachineDefinition } from "./modules/machine/MachineDefinition";
import { SlotDefinition } from "./modules/machine/SlotDefinition";
import { PickerDefinition } from "./modules/machine/PickerDefinition";

const basicSymbols = [
    'lv1', 
    'lv2', 
    'lv3', 
    'lv4', 
    'lv5', 
    'hv1',
    'hv2',
    'hv3', 
    'hv4',
    'hv5'
];
const reelCount = 5;
const symbolCount = 60;

const reels = [];
for (let reelIndex = 0; reelIndex < reelCount; reelIndex++) {
    const reel = [];
    for (let symbolIndex = 0; symbolIndex < symbolCount; symbolIndex++) {
        reel.push(basicSymbols[symbolIndex % basicSymbols.length]);
    }
    reels.push(reel);
}

export const machineDefinition: MachineDefinition = {
    base: <SlotDefinition>{
        name: 'base',
        type: 'Slot',
        rowCount: 3,
        reels: reels,
        paytable: {
            'lv1': {
                3: 5,
                4: 10,
                5: 20
            },
            'lv2': {
                3: 5,
                4: 10,
                5: 20
            },
            'lv3': {
                3: 5,
                4: 10,
                5: 20
            },
            'lv4': {
                3: 5,
                4: 10,
                5: 20
            },
            'lv5': {
                3: 5,
                4: 10,
                5: 20
            },
            'hv1': {
                3: 5,
                4: 10,
                5: 20
            },
            'hv2': {
                3: 5,
                4: 10,
                5: 20
            },
            'hv3': {
                3: 5,
                4: 10,
                5: 20
            },
            'hv4': {
                3: 5,
                4: 10,
                5: 20
            },
            'hv5': {
                3: 5,
                4: 10,
                5: 20
            }
        },
        paylines: [
            [0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1],
            [2, 2, 2, 2, 2],
            [0, 1, 2, 1, 0],
            [2, 1, 0, 1, 2],
            [0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1],
            [1, 2, 1, 2, 1],
            [2, 1, 2, 1, 2]
        ],
        wilds: ['wi']
    },
    features: {
        'picker': <PickerDefinition>{
            name: 'picker',
            type: 'Picker',
            picks: [['pi1', 'pi2', 'pi3', 'pi4', 'pi5']],
            weights: [[1, 1, 1, 1, 1]],
            payouts: [[2, 3, 4, 5, 6]]
        }
    }
};