import { Scene, SceneEvent } from '../modules/scenes/Scene';
import { ReelSet } from '../components/ReelSet';
import { Ui, UiEvent } from '../ui/Ui';
import { MachineDefinition, SlotDefinition } from '../modules/machine/MachineDefinition';
import * as gsap from 'gsap';
import { Application } from '../Application';
import { StateManager } from '../modules/states/StateManager';
import { State } from '../modules/states/State';

export class MainScene extends Scene {
    protected reelSet: ReelSet;
    protected ui: Ui;
    protected slotDefinition: SlotDefinition;

    constructor(application: Application, ui: Ui, slotDefinition: SlotDefinition) {
        super(application);
        this.ui = ui;
        this.slotDefinition = slotDefinition;
    }

    public init() {
        this.reelSet = new ReelSet(this.slotDefinition);
        this.addChild(this.reelSet);
        (window as any).reelSet = this.reelSet;
    }

    public enter(previousScene: string, ...args: any[]) {
        this.ui.setVisible(true);
        //this.ui.events.on(UiEvent.SpinButtonClick, this.eventCallbacks.onSpinButtonClick);
        //this.application.renderer.plugins.interaction.on('pointerdown', this.eventCallbacks.onStagePointerDown);
    }

    public exit(nextScene: string, ...args: any[]) {
        //this.ui.events.removeListener(UiEvent.SpinButtonClick, this.eventCallbacks.onSpinButtonClick);
        //this.application.renderer.plugins.interaction.removeListener('pointerdown', this.eventCallbacks.onStagePointerDown);
    }
    
    public startSpin() {
        const timeline = new gsap.TimelineLite();
        for (const reel of this.reelSet.reels) {
            timeline.to(reel, 1.5, {
                position: reel.position - 20
            }, 0);
        }
        timeline.eventCallback('onComplete', () => this.application.minimumSpinDelayElapsed());
    }

    public resize() {
        this.resizeReelSet();
    }

    public resizeReelSet() {
        this.reelSet.height = window.innerHeight * 0.8;
        this.reelSet.scale.x = this.reelSet.scale.y;
        this.reelSet.x = (window.innerWidth - this.reelSet.width) * 0.5;
        this.reelSet.y = window.innerHeight * 0.1;
    }
}