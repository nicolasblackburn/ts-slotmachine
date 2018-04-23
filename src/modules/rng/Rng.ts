export class Rng {
    public draw(reels: string[][]) {
        return reels
            .map(reel => Math.floor(Math.random() * reel.length));
    }
}