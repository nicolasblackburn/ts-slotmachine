import {AbstractApplication} from './AbstractApplication';
import { PreloadScene, PreloadSceneEvent } from './scenes/PreloadScene';
import { TitleScene } from './scenes/TitleScene';
import { MainScene, MainSceneEvent } from './scenes/MainScene';
import { MachineDefinition } from './modules/machine/MachineDefinition';
import { SlotDefinition } from './modules/machine/SlotDefinition';
import { PlayResponse } from './modules/client/PlayResponse';
import { ApplicationEvent } from './ApplicationEvent';

export class Application extends AbstractApplication {
    protected preloadScene: PreloadScene;
    protected titleScene: TitleScene;
    protected mainScene: MainScene;

    constructor(machineDefinition: MachineDefinition) {
        super(machineDefinition);

        const baseDefinition = <SlotDefinition>this.machineDefinition.base;

        this.bet.lineCount = baseDefinition.paylines.length;

        this.preloadScene = new PreloadScene();
        //this.preloadScene.addResource('preload', 'assets/img/preload.json');

        this.titleScene = new TitleScene();

        this.mainScene = new MainScene(baseDefinition)
            .addResource('sprites', 'assets/img/sprites.json');

        this.scenes
            .add('preload', this.preloadScene)
            .add('title', this.titleScene)
            .add('main', this.mainScene)
            .setCurrent('preload')
            .on(PreloadSceneEvent.Complete, () => {
                this.scenes.setCurrent('title');
    
                this.renderer.plugins.interaction.once('pointerdown', () => {
                    this.scenes.setCurrent('main');
                    this.ui.setVisible(true);
                });
            });
    }
}