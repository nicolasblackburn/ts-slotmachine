import {Reel} from './Reel';
import {htorgb} from '../functions';

const BASIC_SYMBOLS = [
    'sym_10', 
    'sym_j', 
    'sym_q', 
    'sym_k', 
    'sym_a', 
    'sym_apple',
    'sym_banana',
    'sym_grape', 
    'sym_lemon',
    'sym_cherry'
];


export class ReelSet extends PIXI.Container {
    public reels: Reel[] = [];
    protected symbols: PIXI.Container;

    constructor() {
        super();

        this.symbols = new PIXI.Container();
        this.addChild(this.symbols);

        const rowCount = 3;
        const reelCount = 5;
        const symbolCount = 60;
        const texture = PIXI.Texture.fromFrame(BASIC_SYMBOLS[0]);
        const symbolHeight = texture.height;
        const symbolWidth = texture.width;

        for (let reelIndex = 0; reelIndex < reelCount; reelIndex++) {
            const reel = new Reel(rowCount);
            for (let symbolIndex = 0; symbolIndex < symbolCount; symbolIndex++) {
                const textureIndex = symbolIndex % BASIC_SYMBOLS.length;
                const texture = PIXI.Texture.fromFrame(BASIC_SYMBOLS[textureIndex]);
                const symbol = new PIXI.Sprite(texture);
                symbol.visible = false;
                symbol.tint = htorgb(330 - 360 * textureIndex / BASIC_SYMBOLS.length);
                this.symbols.addChild(symbol);
                reel.addSymbol(symbol);
                if (symbolIndex === 0) {
                    reel.rowHeight = symbolHeight;
                    reel.x = reelIndex * symbolWidth;
                }
            }
            reel.update();
            this.reels.push(reel);
        }

        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, symbolWidth * reelCount, symbolHeight * rowCount);
        mask.endFill();

        this.addChild(mask);
        this.symbols.mask = mask;
    }
}