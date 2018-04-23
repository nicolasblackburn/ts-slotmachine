export class Rng {
    public draw(reels: string[][]) {
        return reels
            .map(reel => Math.floor(Math.random() * reel.length));
    }

    public getSymbols(reels: string[][], rowCount: number, positions: number[]) {
        return positions.map((position, reelIndex) => {
            const column = reels[reelIndex].slice(position, position + rowCount);
            if (column.length < rowCount) {
                return column.concat(reels[reelIndex].slice(0, rowCount - column.length));
            } else {
                return column;
            }
        });
    }
}