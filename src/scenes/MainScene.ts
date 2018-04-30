import { Scene } from '../modules/scenes/Scene';
import { ReelSet } from '../components/reels/ReelSet';
import { MachineDefinition } from '../modules/machine/MachineDefinition';
import * as gsap from 'gsap';
import { Application } from '../Application';
import { StateManager } from '../modules/states/StateManager';
import { State } from '../modules/states/State';
import { SlotDefinition } from '../modules/machine/SlotDefinition';
import { PlayResponse } from '../modules/client/PlayResponse';
import { SlotResult } from '../modules/client/SlotResult';
import { modulo } from '../functions';
import { ApplicationEventListener } from '../ApplicationEventListener';
import { ApplicationEventAction } from '../ApplicationEventAction';
import { MainSceneApplicationEventAction } from './MainSceneApplicationEventAction';

export class MainScene extends Scene {
    protected reelSet: ReelSet;
    protected slotDefinition: SlotDefinition;
    protected applicationEventListener: ApplicationEventListener;

    constructor(application: Application, slotDefinition: SlotDefinition) {
        super(application);
        this.slotDefinition = slotDefinition;
    }

    public init() {
        this.reelSet = new ReelSet(this.slotDefinition);
        this.addChild(this.reelSet);
        (window as any).reelSet = this.reelSet;

        this.applicationEventListener = new MainSceneApplicationEventAction(this.application, this.reelSet);
        this.application.addApplicationEventListener(this.applicationEventListener);
    }

    public resize() {
        this.resizeReelSet();
    }

    public update() {
        this.reelSet.update();
    }

    protected resizeReelSet() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.reelSet.height = height * 0.8;
        this.reelSet.scale.x = this.reelSet.scale.y;
        this.reelSet.x = (width - this.reelSet.width) * 0.5;
        this.reelSet.y = height * 0.1;
    }
}