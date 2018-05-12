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
    'wi'
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
                3: 2,
                4: 4,
                5: 8
            },
            'lv2': {
                3: 3,
                4: 6,
                5: 12
            },
            'lv3': {
                3: 4,
                4: 8,
                5: 16
            },
            'lv4': {
                3: 5,
                4: 10,
                5: 20
            },
            'lv5': {
                3: 6,
                4: 12,
                5: 24
            },
            'hv1': {
                3: 10,
                4: 20,
                5: 30
            },
            'hv2': {
                3: 15,
                4: 30,
                5: 45
            },
            'hv3': {
                3: 20,
                4: 40,
                5: 60
            },
            'hv4': {
                3: 25,
                4: 50,
                5: 100
            },
            'wi': {
                3: 50,
                4: 100,
                5: 200
            }
        },
        paylines: [
            [1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0],
            [2, 2, 2, 2, 2],
            [0, 1, 2, 1, 0],
            [2, 1, 0, 1, 2],
            [1, 0, 0, 0, 1],
            [1, 2, 2, 2, 1],
            [0, 0, 1, 2, 2],
            [2, 2, 1, 0, 0],
            [1, 0, 1, 2, 1],
            [1, 2, 1, 0, 1],
            [0, 1, 1, 1, 0],
            [2, 1, 1, 1, 2],
            [0, 1, 0, 1, 0],
            [2, 1, 2, 1, 2],
            [1, 1, 0, 1, 1],
            [1, 1, 2, 1, 1],
            [0, 0, 2, 0, 0],
            [2, 2, 0, 2, 2],
            [0, 2, 2, 2, 0],
            [2, 0, 0, 0, 2],
            [0, 0, 1, 0, 0],
            [2, 2, 1, 2, 2],
            [1, 0, 1, 0, 1],
            [1, 2, 1, 2, 1]
        ],
        wilds: ['wi'],
        wildInPaytable: 'wi'
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