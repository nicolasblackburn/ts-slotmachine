export interface SquareGridNode<T> {
    value: T;
    top: SquareGridNode<T>;
    left: SquareGridNode<T>;
    bottom: SquareGridNode<T>;
    right: SquareGridNode<T>;
    row: number;
    column: number;
}

export function createSquareGrid<T>(rowsCount: number, columnsCount: number, values?: T[][]) {
    if (rowsCount <= 0 || columnsCount <= 0) {
        return null;
    } else {
        const grid = [];
        for (let i = 0; i < rowsCount; i++) {
            grid[i] = [];
            for (let j = 0; j < columnsCount; j++) {
                grid[i][j] = {
                    value: values && typeof values[i] !== 'undefined' && typeof values[i][j] !== 'undefined' ? values[i][j] : null,
                    top: i > 0 ? grid[i - 1][j] : null,
                    left: j > 0 ? grid[i][j - 1] : null,
                    bottom: null,
                    right: null,
                    row: i,
                    column: j
                };
                if (i > 0) {
                    grid[i - 1][j].bottom = grid[i][j];
                }
                if (j > 0) {
                    grid[i][j - 1].right = grid[i][j];
                }
            }
        }
        return grid;
    }
}

export function getClusters<T>(node: SquareGridNode<T>, isWild: (value: T) => boolean = (value) => false) {
    const recGetCluster = (value: T, node: SquareGridNode<T>, visited: SquareGridNode<T>[], unvisited: SquareGridNode<T>[], visitedWilds: SquareGridNode<T>[]) => {
        if (node === null || visited.includes(node)) {
            return [];
        } else if (isWild(node.value) || isWild(value) || node.value === value) {
            let cluster = [node];
            unvisited.splice(unvisited.indexOf(node), 1);
            visited.push(node);
            if (isWild(node.value)) {
                visitedWilds.push(node);
            }
            cluster = cluster.concat(recGetCluster(value, node.top, visited, unvisited, visitedWilds));
            cluster = cluster.concat(recGetCluster(value, node.left, visited, unvisited, visitedWilds));
            cluster = cluster.concat(recGetCluster(value, node.bottom, visited, unvisited, visitedWilds));
            cluster = cluster.concat(recGetCluster(value, node.right, visited, unvisited, visitedWilds));
            return cluster
        } else {
            return [];
        }
    }; 
    const unvisited = [];
    let rowNode = node;
    let allWilds = true;
    while (rowNode) {
        let columnNode = rowNode;
        while (columnNode) {
            unvisited.push(columnNode);
            allWilds = allWilds && isWild(columnNode.value);
            columnNode = columnNode.right;
        }
        rowNode = rowNode.bottom;
    }
    if (allWilds) {
        return [unvisited];
    } else {
        const clusters = [];
        let hasNonWilds = true;
        const visited = [];
        const visitedWilds = [];
        while (unvisited.length && hasNonWilds) {
            const nonWildIndex = unvisited.findIndex(node => !isWild(node.value));
            if (nonWildIndex >= 0) {
                // If there is a non-wild, pick it and push it's cluster
                clusters.push(recGetCluster(unvisited[nonWildIndex].value, unvisited[nonWildIndex], visited, unvisited, visitedWilds));
    
                // Put back the visited wilds in the unvisted list
                while (visitedWilds.length) {
                    const wild = visitedWilds.pop();
                    unvisited.push(wild);
                    visited.splice(visited.indexOf(wild), 1);
                }
    
            } else {
                hasNonWilds = false;
            }
        }
        return clusters;
    }
}