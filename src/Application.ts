import {Application as ParentApplication} from './modules/Application';
import { PreloadScene, PreloadSceneEvent } from './scenes/PreloadScene';
import { TitleScene } from './scenes/TitleScene';
import { MainScene } from './scenes/MainScene';

export class Application extends ParentApplication {
    protected init() {
        this.scenes.add('preload', new PreloadScene(this))
        this.scenes.add('title', new TitleScene(this))
        this.scenes.add('main', new MainScene(this, this.ui, this.machineDefinition.base));
    
        this.scenes
            .get('preload')
            .addResource('preload', 'assets/img/preload.json');
    
        this.scenes
            .get('main')
            .addResource('sprites', 'assets/img/sprites.json');
    
        this.scenes
            .setCurrent('preload')
            .on(PreloadSceneEvent.Complete, () => {
                this.scenes.setCurrent('title');
    
                this.renderer.plugins.interaction.once('pointerdown', () => {
                    this.scenes.setCurrent('main');
                });
            });
    }
}