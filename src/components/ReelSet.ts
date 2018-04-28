import { Reel } from './Reel';
import { htorgb } from '../functions';
import { SlotDefinition } from '../modules/machine/SlotDefinition';

const BASIC_SYMBOLS = {
    'lv1': 'sym_10', 
    'lv2': 'sym_j', 
    'lv3': 'sym_q', 
    'lv4': 'sym_k', 
    'lv5': 'sym_a', 
    'hv1': 'sym_apple',
    'hv2': 'sym_banana',
    'hv3': 'sym_grape', 
    'hv4': 'sym_lemon',
    'hv5': 'sym_cherry'
};

export class ReelSet extends PIXI.Container {
    public reels: Reel[] = [];
    protected symbols: PIXI.Container;
    protected slotDefinition: SlotDefinition;

    constructor(slotDefinition: SlotDefinition) {
        super();
        this.slotDefinition = slotDefinition;

        this.symbols = new PIXI.Container();
        this.addChild(this.symbols);

        const texture = PIXI.Texture.fromFrame(BASIC_SYMBOLS['lv1']);
        const symbolHeight = texture.height;
        const symbolWidth = texture.width;
        const basicSymbolCount = Object.keys(BASIC_SYMBOLS).length;

        for (const [reelIndex, reelData] of Object.entries(this.slotDefinition.reels)) {
            const reel = new Reel(this.slotDefinition.rowCount);
            for (const [symbolIndex, symbolName] of Object.entries(reelData)) {
                const textureIndex = parseInt(symbolIndex) % basicSymbolCount;
                const texture = PIXI.Texture.fromFrame(BASIC_SYMBOLS[symbolName]);
                const symbol = new PIXI.Sprite(texture);
                symbol.visible = false;
                symbol.tint = htorgb(330 - 360 * textureIndex / basicSymbolCount);
                this.symbols.addChild(symbol);
                reel.addSymbol(symbol);
                if (parseInt(symbolIndex) === 0) {
                    reel.rowHeight = symbolHeight;
                    reel.x = parseInt(reelIndex) * symbolWidth;
                }
            }
            reel.update();
            this.reels.push(reel);
        }

        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, symbolWidth * this.reels.length, symbolHeight * this.slotDefinition.rowCount);
        mask.endFill();

        this.addChild(mask);
        this.symbols.mask = mask;
    }

    public update() {
        for (const reel of this.reels) {
            reel.update();
        }
    }
}