import { Scene, SceneEvent } from '../modules/scenes/Scene';
import { ReelSet } from '../components/ReelSet';
import { Ui, UiEvent } from '../ui/Ui';
import { MachineDefinition, SlotDefinition } from '../modules/machine/MachineDefinition';
import * as gsap from 'gsap';
import { Application } from '../Application';
import { StateManager } from '../modules/states/StateManager';
import { State } from '../modules/states/State';

export class MainScene extends Scene {
    public state: StateManager<MainSceneState>;
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

        this.state = new StateManager();
        this.state.add('idle', new IdleState(this, this.reelSet));
        this.state.add('spinning', new SpinningState(this, this.reelSet));
        this.state.setCurrent('idle');
    }

    public enter() {
        this.ui.setVisible(true);

        const onSpinButtonClick = () => {
            this.state.current().onSpinButtonClick();
        };

        const onStagePointerDown = () => {
            this.state.current().onStagePointerDown();
        };

        this.ui.events.on(UiEvent.SpinButtonClick, onSpinButtonClick);

        this.application.renderer.plugins.interaction.on('pointerdown', onStagePointerDown);

        this.once(SceneEvent.Exit, () => {
            this.ui.events.removeListener(UiEvent.SpinButtonClick, onSpinButtonClick);
            this.application.renderer.plugins.interaction.removeListener('pointerdown', onStagePointerDown);
        });
    }

    public exit() {
        this.emit(SceneEvent.Exit);
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

abstract class MainSceneState extends State {
    protected scene: MainScene;
    protected reelSet: ReelSet;

    constructor(scene: MainScene, reelSet: ReelSet) {
        super();
        this.scene = scene;
        this.reelSet = reelSet;
    }

    public onSpinButtonClick() {}
    public onStagePointerDown() {}
    public onUpdate() {}
};

class IdleState extends MainSceneState {
    public onSpinButtonClick() {
        this.scene.state.setCurrent('spinning');
    }
}

class SpinningState extends MainSceneState {
    public enter() {
        const timeline = new gsap.TimelineLite();
        for (const reel of this.reelSet.reels) {
            timeline.to(reel, 0.5, {
                position: reel.position - 1
            }, 0);
        }
    }
    
    public onSpinButtonClick() {
        console.log("Yo I'm spinning and you clicked on the spin button!");
    }
}