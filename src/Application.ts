import { SceneManager } from './modules/scenes/SceneManager';
import { PreloadScene, PreloadSceneEvent } from './scenes/PreloadScene';
import { TitleScene } from './scenes/TitleScene';
import { MainScene } from './scenes/MainScene';
import { Ui, UiEvent } from './ui/Ui';
import { Client } from './modules/client/Client';
import { LocalClient } from './modules/client/local/LocalClient';
import { machineDefinition } from './machineDefinition';
import { promiseFold } from './functions';
import { Bet } from './modules/bet/Bet';

export class Application extends PIXI.Application {
    protected scenes: SceneManager;
    protected ui: Ui;
    protected client: Client;

    constructor() {
        super({
            width: window && window.innerWidth || 1280,
            height: window && window.innerHeight || 720,
            resolution: window && window.devicePixelRatio || 1
        });

        this.renderer.backgroundColor = 0x080010;
        document.body.appendChild(this.view);

        this.client = new LocalClient(machineDefinition);

        this.ui = new Ui();
        document.body.appendChild(this.ui.uiContainer);

        this.scenes = new SceneManager(this);
        this.ticker.add(deltaTime => this.scenes.update());
        this.initScenes();

        window.addEventListener('resize', () => this.resize());
        this.resize();
    }

    public resize() {
        this.renderer.resize(window.innerWidth, window.innerHeight);
        this.scenes.resize();
    }

    public initScenes() {
        this.scenes.add('preload', new PreloadScene())
        this.scenes.add('title', new TitleScene())
        this.scenes.add('main', new MainScene(machineDefinition.features['base'], this.ui, this));

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