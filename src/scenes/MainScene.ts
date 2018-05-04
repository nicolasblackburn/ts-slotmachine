import { Scene } from '../modules/scenes/Scene';
import { ReelSet } from '../components/reels/ReelSet';
import { MachineDefinition } from '../modules/machine/MachineDefinition';
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
import { NumberSprite } from '../components/NumberSprite';
import * as gsap from 'gsap';

export class MainScene extends Scene {
    protected reelSet: ReelSet;
    protected slotDefinition: SlotDefinition;
    protected applicationEventAction: MainSceneApplicationEventAction;
    protected numberSprite: NumberSprite;

    constructor(application: Application, slotDefinition: SlotDefinition) {
        super(application);
        this.slotDefinition = slotDefinition;
    }

    public init() {
        this.numberSprite = new NumberSprite();
        this.numberSprite.visible = false;
        this.numberSprite.value = '0.00';

        this.reelSet = new ReelSet(this.slotDefinition);
        (window as any).reelSet = this.reelSet;

        this.applicationEventAction = new MainSceneApplicationEventAction(this.application, this.reelSet, this.numberSprite);
        this.application.addApplicationEventListener(this.applicationEventAction);

        this.addChild(this.reelSet);
        this.addChild(this.numberSprite);
    }

    public enter() {
        this.applicationEventAction.active = true;
    }

    public exit() {
        this.applicationEventAction.active = false;
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
        
        this.numberSprite.x = (width - this.numberSprite.width) / 2;
        this.numberSprite.y = (height + this.numberSprite.height) / 2;
    }
}