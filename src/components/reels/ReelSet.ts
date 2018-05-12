import { Reel } from './Reel';
import { htorgb } from '../../functions';
import { SlotDefinition } from '../../modules/machine/SlotDefinition';
import { ReelSymbol } from './ReelSymbol';
import * as gsap from 'gsap';

export class ReelSet extends PIXI.Container {
    public reels: Reel[] = [];
    public maxVelocity: number = 0.3;
    protected currentTween: gsap.Animation;
    protected symbols: PIXI.Container;
    protected slotDefinition: SlotDefinition;
    protected symbolDefinitions: {[symbol: string]: string};
    protected lastStoppedReelIndex: number;

    constructor(slotDefinition: SlotDefinition, symbolDefinitions: {[symbol: string]: string}) {
        super();
        this.slotDefinition = slotDefinition;
        this.symbolDefinitions = symbolDefinitions;

        this.symbols = new PIXI.Container();
        this.addChild(this.symbols);

        const texture = PIXI.Texture.fromFrame(Object.values(this.symbolDefinitions)[0]);
        const symbolHeight = texture.height;
        const symbolWidth = texture.width;
        const basicSymbolCount = Object.keys(this.symbolDefinitions).length;
        for (const [reelIndex, reelData] of Object.entries(this.slotDefinition.reels)) {
            const reel = new Reel(this.slotDefinition.rowCount);
            for (const [symbolIndex, symbolName] of Object.entries(reelData)) {
                const textureIndex = parseInt(symbolIndex) % basicSymbolCount;
                const texture = PIXI.Texture.fromFrame(this.symbolDefinitions[symbolName]);

                const symbol = new ReelSymbol(texture);
                symbol.visible = false;
                symbol.tint = htorgb(330 - 360 * textureIndex / basicSymbolCount);

                const substitution = new ReelSymbol(texture);
                substitution.visible = false;
                substitution.tint = htorgb(330 - 360 * textureIndex / basicSymbolCount);

                this.symbols.addChild(symbol, substitution);
                reel.addSymbol(symbol, substitution);
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

    public spinStart() {
        if (this.currentTween) {
            this.currentTween.kill();
        }

        this.lastStoppedReelIndex = -1;

        const timeline = new gsap.TimelineLite();
        this.currentTween = timeline;
        for (const reel of this.reels) {
            timeline.add(reel.spinStart(this.maxVelocity), 0);
        }

        return timeline;
    }

    public spinEnd(positions: number[]) {
        return new Promise((resolve) => {
            if (this.currentTween) {
                this.currentTween.kill();
            }
            const timeline = new gsap.TimelineLite();
            this.currentTween = timeline;
            this.reels.forEach((reel, reelIndex) => {
                timeline
                    .call(() => { 
                        this.lastStoppedReelIndex = reelIndex; 
                        if (reelIndex < this.reels.length - 1) {
                            reel.spinEnd(positions[reelIndex]);
                        } else {
                            reel.spinEnd(positions[reelIndex]).then(() => resolve());
                        }
                    }, null, null, reelIndex * 0.3);
            });
        });
    }
    
    public slam(positions: number[]) {
        if (this.currentTween) {
            this.currentTween.kill();
        }
        const timeline = new gsap.TimelineLite();
        this.currentTween = timeline;
        this.reels.slice(this.lastStoppedReelIndex + 1).forEach((reel, reelIndex) => {
            timeline.call(() => reel.spinEnd(positions[reelIndex]), null, null, 0);
        });
        this.lastStoppedReelIndex = this.reels.length - 1;

        return timeline;
    }

    public getSymbolAt(reelIndex: number, position: number) {
        return this.reels[reelIndex].getSymbolAt(position);
    }
}