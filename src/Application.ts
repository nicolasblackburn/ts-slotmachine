import {SceneManager} from './modules/scenes/SceneManager';
import { PreloadScene, PreloadSceneEvent } from './scenes/PreloadScene';
import { TitleScene } from './scenes/TitleScene';
import { MainScene } from './scenes/MainScene';

export class Application extends PIXI.Application {
    protected scenes: SceneManager;

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
        window.addEventListener('resize', () => this.resize());
        this.resize();

        this.scenes.add('preload', new PreloadScene(this))
        this.scenes.add('title', new TitleScene(this))
        this.scenes.add('main', new MainScene(this));

        this.scenes
            .get('preload')
            .addResource('preload', 'assets/img/preload.json');

        this.scenes
            .get('main')
            .addResource('sprites', 'assets/img/sprites.json');

        this.scenes
            .show('preload')
            .events.on(PreloadSceneEvent.Complete, () => {
                this.scenes
                    .show('title')
                    .once('pointerdown', () => {
                        this.scenes.show('main');
                    });
            });
    }

    public  resize() {
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
        this.scenes.resize();
    }
}