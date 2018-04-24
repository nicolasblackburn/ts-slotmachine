import { Scene, SceneEvent } from '../modules/scenes/Scene';
import { ReelSet } from '../components/ReelSet';
import { Ui, UiEvent } from '../ui/Ui';
import { MachineDefinition, SlotDefinition } from '../modules/machine/MachineDefinition';
import * as gsap from 'gsap';
import { Application } from '../Application';

export class MainScene extends Scene {
    protected application: Application;
    protected reelSet: ReelSet;
    protected ui: Ui;
    protected slotDefinition: SlotDefinition;

    constructor(slotDefinition: SlotDefinition, ui: Ui, application: Application) {
        super();
        this.application = application;
        this.ui = ui;
        this.slotDefinition = slotDefinition;
    }

    public init() {
        this.reelSet = new ReelSet(this.slotDefinition);
        this.addChild(this.reelSet);
        (window as any).reelSet = this.reelSet;
    }

    public show() {
        this.ui.setVisible(true);

        const onSpinButtonClick = () => {
            // this.state.onSpinButtonClick();
            console.log('onSpinButtonClick');
            const timeline = new gsap.TimelineLite();
            for (const reel of this.reelSet.reels) {
                timeline.to(reel, 0.5, {
                    position: reel.position - 1
                }, 0);
            }
        };

        const onStagePointerDown = () => {
            // this.state.onStagePointerDown();
            console.log('onStagePointerDown');
        };

        this.ui.events.on(UiEvent.SpinButtonClick, onSpinButtonClick);

        this.application.renderer.plugins.interaction.on('pointerdown', onStagePointerDown);

        this.once(SceneEvent.Hide, () => {
            this.ui.events.removeListener(UiEvent.SpinButtonClick, onSpinButtonClick);
            this.application.renderer.plugins.interaction.removeListener('pointerdown', onStagePointerDown);
        });
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