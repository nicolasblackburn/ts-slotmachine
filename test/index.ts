import * as Math from '../src/modules/math/Math';
import { GameController, DefaultGameControllerObserver } from '../src/GameController';
import { machineDefinition } from '../src/machineDefinition';
import { LocalClient } from '../src/modules/client/local/LocalClient';
import { PlayResponse } from '../src/modules/client/PlayResponse';
import { Win } from '../src/modules/client/Win';
import { Bet } from '../src/modules/bet/Bet';
import * as fun from '../src/modules/functional';

function testClusters () {
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
}

function testGameController() {
    const client = new LocalClient(machineDefinition);
    
    class Observer extends DefaultGameControllerObserver {
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

    const controller = new GameController({
        observer: new Observer(),
        play: (bet: Bet) => client.play(bet),
        createBet: (credits: number, betsCount: number) => new Bet(credits, betsCount)
    });

    controller.roundStart();
}

function functional() {
    const {composeList, head, id, map, maybe, Maybe, prop, toString: _toString} = fun;

    const safeHead = xs => Maybe.of(head(xs));
    const streetName = composeList([map(prop('street')), safeHead, prop('addresses')]);
    const toString = maybe('Nothing', _toString); 

    console.log(
        toString(streetName({ addresses: [] })));

    console.log(
        toString(streetName({ addresses: [{ street: 'Shady Ln.', number: 4201 }] })));

}

functional();
