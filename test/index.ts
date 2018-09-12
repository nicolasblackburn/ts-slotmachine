import * as Math from '../src/modules/math/Math';

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