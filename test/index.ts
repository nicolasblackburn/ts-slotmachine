import * as Math from '../src/modules/math/Math';
import { GameController, BaseGameControllerListener } from '../src/GameController';
import { machineDefinition } from '../src/machineDefinition';
import { LocalClient } from '../src/modules/client/local/LocalClient';
import { PlayResponse } from '../src/modules/client/PlayResponse';
import { Win } from '../src/modules/client/Win';

/*
const values = [
    [1, 1, 2, 3, 4],
    [1, 1, 0, 2, 0],
    [1, 2, 9, 4, 4]
];
console.log(values.map(row => row.join(',')).join('\n'));
const grid = Math.createSquareGrid(3, 5, values);
const isWild = (value) => value === 0 || value === 9;
const clusters = Math.getClusters(grid[0][0], isWild);
for (const cluster of clusters) {
    console.log(`Cluster of ${isWild(cluster[0].value) ? 'wild' : cluster[0].value}:\n`, cluster.map(node => `(${node.row},${node.column})`));
}
*/

const client = new LocalClient(machineDefinition);

class Listener extends BaseGameControllerListener {
    public spinStart() {
        console.log('Spin Start');
        return Promise.resolve();
    }
    public spinEnd(response: PlayResponse) {
        console.log('Spin End');
        return Promise.resolve();
    }
    public showTotalWin(amount: number) {
        console.log(`Total Win: ${(amount / 100).toFixed(2)}`);
        return Promise.resolve();
    }
    public showWin(win: Win) {
        console.log(`Win: ${(win.amount / 100).toFixed(2)}`);
        return Promise.resolve();
    }
    public playFeature(feature: string) {
        console.log(`Play feature: ${feature}`);
        return Promise.resolve();
    }
    public roundEnd() {
        console.log(`Round End`);
        return Promise.resolve();
    }
}

const controller = new GameController(client);
controller.setListener(new Listener());
controller.start();