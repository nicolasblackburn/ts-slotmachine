import {AbstractApplication} from './AbstractApplication';
import { PreloadScene, PreloadSceneEvent } from './scenes/PreloadScene';
import { TitleScene } from './scenes/TitleScene';
import { MainScene } from './scenes/MainScene';
import { MachineDefinition } from './modules/machine/MachineDefinition';
import { SlotDefinition } from './modules/machine/SlotDefinition';

export class Application extends AbstractApplication {
    constructor(machineDefinition: MachineDefinition) {
        super(machineDefinition);

        const baseDefinition = <SlotDefinition>this.machineDefinition.base;

        this.bet.lineCount = baseDefinition.paylines.length;

        this.scenes.add('preload', new PreloadScene(this))
        this.scenes.add('title', new TitleScene(this))
        this.scenes.add('main', new MainScene(this, baseDefinition));
    
        /*
        this.scenes
            .get('preload')
            .addResource('preload', 'assets/img/preload.json');
        */

        this.scenes
            .get('main')
            .addResource('sprites', 'assets/img/sprites.json');
    
        this.scenes
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