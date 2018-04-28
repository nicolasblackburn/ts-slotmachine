import { Scene } from '../modules/scenes/Scene';
import { ReelSet } from '../components/ReelSet';
import { MachineDefinition } from '../modules/machine/MachineDefinition';
import * as gsap from 'gsap';
import { Application } from '../Application';
import { StateManager } from '../modules/states/StateManager';
import { State } from '../modules/states/State';
import { SlotDefinition } from '../modules/machine/SlotDefinition';

export class MainScene extends Scene {
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
                    velocity: -0.3
                }, 0.12);
        }
        timeline.to({}, .86, {});
        timeline.eventCallback('onComplete', () => this.application.spinEndReady());
    }

    public spinEnd() {
        const timeline = new gsap.TimelineLite();
        for (const reel of this.reelSet.reels) {
            timeline
                .to(reel, 0.05, {
                    ease: gsap.Quad.easeOut,
                    velocity: 0.2
                }, 0)
                .to(reel, 0.05, {
                    ease: gsap.Quad.easeIn,
                    velocity: 0
                }, 0.05);
        }
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