import {SceneManager} from './modules/scenes/SceneManager';
import { PreloadScene, PreloadSceneEvent } from './scenes/PreloadScene';
import { TitleScene } from './scenes/TitleScene';
import { MainScene } from './scenes/MainScene';
import { Ui } from './ui/Ui';

export class Application extends PIXI.Application {
    protected scenes: SceneManager;
    protected ui: Ui;

    constructor() {
        super({
            width: window && window.innerWidth || 1280,
            height: window && window.innerHeight || 720,
            resolution: window && window.devicePixelRatio || 1
        });

        this.renderer.backgroundColor = 0x080010;

        this.scenes = new SceneManager(this);
        this.ticker.add(deltaTime => this.scenes.update());

        document.body.appendChild(this.view);
        
        this.ui = new Ui();
        document.body.appendChild(this.ui.uiContainer);

        window.addEventListener('resize', () => this.resize());
        this.resize();

        this.scenes.add('preload', new PreloadScene())
        this.scenes.add('title', new TitleScene())
        this.scenes.add('main', new MainScene(this.ui));

        this.scenes
            .get('preload')
            .addResource('preload', 'assets/img/preload.json');

        this.scenes
            .get('main')
            .addResource('sprites', 'assets/img/sprites.json');

        this.scenes
            .show('preload')
            .on(PreloadSceneEvent.Complete, () => {
                this.scenes.show('title');

                this.renderer.plugins.interaction.once('pointerdown', () => {
                    this.scenes.show('main');
                });
            });
    }

    public resize() {
        this.renderer.resize(window.innerWidth, window.innerHeight);
        this.scenes.resize();
    }
}