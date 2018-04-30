import { Reel } from './Reel';
import { htorgb, modulo } from '../../functions';
import { SlotDefinition } from '../../modules/machine/SlotDefinition';
import * as gsap from 'gsap';

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
    public maxVelocity: number = 0.3;
    protected currentTween: gsap.Animation;
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

                const substitution = new PIXI.Sprite(texture);
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
        const timeline = new gsap.TimelineLite();
        this.currentTween = timeline;
        for (const reel of this.reels) {
            timeline
                .to(reel, 0.12, {
                    ease: gsap.Quad.easeInOut,
                    velocity: 0.2
                }, 0)
                .to(reel, 0.2, {
                    ease: gsap.Quad.easeIn,
                    velocity: -this.maxVelocity
                }, 0.12)
                .addLabel('SpinStartComplete', '+=0');
        }
        timeline.to({}, .86, {});
        return timeline;
    }

    public spinEnd(positions: number[]) {
        if (this.currentTween) {
            this.currentTween.kill();
        }
        const timeline = new gsap.TimelineLite();
        this.currentTween = timeline;
        this.reels.forEach((reel, reelIndex) => {
            const reelTimeline = new gsap.TimelineLite()
            const currentPosition = Math.floor(reel.position);
            const rowCount = this.slotDefinition.rowCount;
            const symbolCount = reel.getSymbolCount();
            const untilPosition = modulo(currentPosition - rowCount, symbolCount);
            for (let i = 0; i < rowCount; i++) {
                reel.substitutions[modulo(currentPosition - rowCount + i, symbolCount)] = modulo(positions[reelIndex] + i, symbolCount);
            }
            const t = (currentPosition - rowCount - reel.position) / -this.maxVelocity / PIXI.ticker.shared.FPS;
            reelTimeline
                .to({}, t, {}, 0)
                .set(reel, {
                    position: untilPosition,
                    velocity: 0
                })
                .to(reel, 0.07, {
                    ease: gsap.Quad.easeOut,
                    position: untilPosition - 0.4
                })
                .to(reel, 0.07, {
                    ease: gsap.Quad.easeIn,
                    position: modulo(untilPosition - 0.4, symbolCount) + 0.4
                })
                .set(reel, {
                    substitutions: {}, 
                    position: positions[reelIndex]
                });

            timeline.add(reelTimeline, 0);
        });

        return timeline;
    }
}