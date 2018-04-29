import { Scene } from '../modules/scenes/Scene';
import { ReelSet } from '../components/ReelSet';
import { MachineDefinition } from '../modules/machine/MachineDefinition';
import * as gsap from 'gsap';
import { Application } from '../Application';
import { StateManager } from '../modules/states/StateManager';
import { State } from '../modules/states/State';
import { SlotDefinition } from '../modules/machine/SlotDefinition';
import { PlayResponse } from '../modules/client/PlayResponse';
import { SlotResult } from '../modules/client/SlotResult';
import { modulo } from '../functions';

export class MainScene extends Scene {
    protected reelMaxVelocity: number = 0.3;
    protected reelSet: ReelSet;
    protected slotDefinition: SlotDefinition;

    constructor(application: Application, slotDefinition: SlotDefinition) {
        super(application);
        this.slotDefinition = slotDefinition;
    }

    public init() {
        this.reelSet = new ReelSet(this.slotDefinition);
        this.addChild(this.reelSet);
        (window as any).reelSet = this.reelSet;
    }

    public enter(previousScene: string, ...args: any[]) {
    }

    public exit(nextScene: string, ...args: any[]) {
    }
    
    public spinStart() {
        const timeline = new gsap.TimelineLite();
        for (const reel of this.reelSet.reels) {
            timeline
                .to(reel, 0.12, {
                    ease: gsap.Quad.easeInOut,
                    velocity: 0.2
                }, 0)
                .to(reel, 0.2, {
                    ease: gsap.Quad.easeIn,
                    velocity: -this.reelMaxVelocity
                }, 0.12);
        }
        timeline.to({}, .86, {});
        timeline.eventCallback('onComplete', () => this.application.spinEndReady());
    }

    public spinEnd(response: PlayResponse) {
        const timeline = new gsap.TimelineLite();
        const result = response.results[0] as SlotResult;
        this.reelSet.reels.forEach((reel, reelIndex) => {
            const reelTimeline = new gsap.TimelineLite()
            const currentPosition = Math.floor(reel.position);
            const length = result.symbols[reelIndex].length;
            const symbolCount = reel.getSymbolCount();
            const untilPosition = modulo(currentPosition - length, symbolCount);
            for (let i = 0; i < length; i++) {
                reel.substitutions[modulo(currentPosition - length + i, symbolCount)] = modulo(result.positions[reelIndex] + i, symbolCount);
            }
            const t = (currentPosition - length - reel.position) / -this.reelMaxVelocity / PIXI.ticker.shared.FPS;
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
                    position: result.positions[reelIndex]
                });

            timeline.add(reelTimeline, 0);
        });
    }

    public resize() {
        this.resizeReelSet();
    }

    public resizeReelSet() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.reelSet.height = height * 0.8;
        this.reelSet.scale.x = this.reelSet.scale.y;
        this.reelSet.x = (width - this.reelSet.width) * 0.5;
        this.reelSet.y = height * 0.1;
    }

    public update() {
        this.reelSet.update();
    }
}