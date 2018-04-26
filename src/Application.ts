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
import { ApplicationModel } from './ApplicationModel';
import { PlayResponse, Win } from './modules/client/PlayResponse';

export enum ApplicationEvent {
    StartRound = 'ApplicationEvent.StartRound',
    EndRound = 'ApplicationEvent.EndRound',
    StartSpin = 'ApplicationEvent.StartSpin',
    EndSpin = 'ApplicationEvent.EndSpin',
    PlayRequestSuccess = 'ApplicationEvent.PlayRequestSuccess',
    PlayRequestError = 'ApplicationEvent.PlayRequestError', 
    StartShowWins = 'ApplicationEvent.StartShowWins',
    EndShowWins = 'ApplicationEvent.EndShowWins',
    StartShowTotalWin = 'ApplicationEvent.StartShowTotalWin',
    EndShowTotalWin = 'ApplicationEvent.EndShowTotalWin',
    StartShowWin = 'ApplicationEvent.StartShowWin',
    EndShowWin = 'ApplicationEvent.EndShowWin',
    StartFeature = 'ApplicationEvent.StartFeature',
    EndFeature = 'ApplicationEvent.EndFeature',
}

export class Application extends PIXI.Application {
    protected scenes: SceneManager;
    public events: PIXI.utils.EventEmitter;
    protected model: ApplicationModel;
    protected ui: Ui;
    protected client: Client;

    constructor() {
        super({
            width: window && window.innerWidth || 1280,
            height: window && window.innerHeight || 720,
            resolution: window && window.devicePixelRatio || 1
        });

        this.events = new PIXI.utils.EventEmitter();

        this.renderer.backgroundColor = 0x080010;
        document.body.appendChild(this.view);

        this.client = new LocalClient(machineDefinition);

        this.model = new ApplicationModel();
        this.model.bet = new Bet(5, machineDefinition.features.base.paylines.length);

        this.ui = new Ui(this.model);
        document.body.appendChild(this.ui.uiContainer);

        this.scenes = new SceneManager(this);
        this.ticker.add(deltaTime => this.scenes.update());
        this.initScenes();

        window.addEventListener('resize', () => this.resize());
        this.resize();

        this.events.on(ApplicationEvent.StartRound, () => this.scenes.startRound());
        this.events.on(ApplicationEvent.EndRound, () => this.scenes.endRound());
        this.events.on(ApplicationEvent.StartSpin, () => this.scenes.startSpin());
        this.events.on(ApplicationEvent.EndSpin, () => this.scenes.endSpin());
        this.events.on(ApplicationEvent.PlayRequestSuccess, (success) => this.scenes.playRequestSuccess(success));
        this.events.on(ApplicationEvent.PlayRequestError, (error) => this.scenes.playRequestError(error));
        this.events.on(ApplicationEvent.StartShowWins, (wins) => this.scenes.startShowWins(wins));
        this.events.on(ApplicationEvent.EndShowWins, (wins) => this.scenes.endShowWins(wins));
        this.events.on(ApplicationEvent.StartShowTotalWin, () => this.scenes.startShowTotalWin());
        this.events.on(ApplicationEvent.EndShowTotalWin, () => this.scenes.endShowTotalWin());
        this.events.on(ApplicationEvent.StartShowWin, (win) => this.scenes.startShowWin(win));
        this.events.on(ApplicationEvent.EndShowWin, (win) => this.scenes.endShowWin(win));
        this.events.on(ApplicationEvent.StartFeature, (feature) => this.scenes.startFeature(feature));
        this.events.on(ApplicationEvent.EndFeature, (feature) => this.scenes.endFeature(feature));
    }

    public resize() {
        this.renderer.resize(window.innerWidth, window.innerHeight);
        this.scenes.resize();
    }

    public startRound() {
        this.model.playResponse = null;
        this.model.canSpin = false;
        this.model.wins = [];
        this.model.notifyObservers();
        this.events.emit(ApplicationEvent.StartRound);
    }

    public endRound() {
        this.model.canSpin = true;
        this.model.notifyObservers();
        this.events.emit(ApplicationEvent.EndRound);
    }

    public startSpin() {
        this.events.emit(ApplicationEvent.StartSpin);
        this.client.play(this.model.bet).then(
            response => this.playRequestSuccess(response),
            error => this.playRequestError(error)
        );
    }

    public endSpin() {
        this.events.emit(ApplicationEvent.EndSpin);
        // Flatten the wins
        this.model.wins = this.model.playResponse.results.reduce(
            (wins, result) => {
                return result.wins.reduce(
                    (wins, win) => {
                        return wins.concat(win);
                    }, 
                    wins
                );
            },
            []
        );
        this.model.notifyObservers();
        if (this.model.playResponse.totalWin > 0) {
            this.startShowWins(this.model.wins);
        }
        const hasFeatures = !!this.model.playResponse.features.length;
        if (!hasFeatures) {
            this.model.canSpin = true;
            this.model.notifyObservers();
        }
        if (!hasFeatures && this.model.playResponse.totalWin === 0) {
            this.endRound();
        }
    }

    public playRequestSuccess(response: PlayResponse) {
        this.model.playResponse = response;
        this.model.notifyObservers();
        this.events.emit(ApplicationEvent.PlayRequestSuccess, response);
    }

    public playRequestError(error: Error) {
        this.events.emit(ApplicationEvent.PlayRequestSuccess, error);
    }

    public startShowWins(wins: Win[]) {
        this.events.emit(ApplicationEvent.StartShowWins, wins);
        this.events.once(ApplicationEvent.EndShowTotalWin, () => {
            const startShowWin = (winIndex) => {
                if (winIndex < wins.length) {
                    const win = wins[winIndex];
                    this.events.once(ApplicationEvent.EndShowWin, () => {
                        startShowWin(winIndex + 1);
                    });
                    this.startShowWin(win);
                } else {
                    this.endShowWins(wins);
                }
            }
            startShowWin(0);
        });
        this.startShowTotalWin();
    }

    public endShowWins(wins: Win[]) {
        this.events.emit(ApplicationEvent.EndShowWins, wins);
        if (this.model.playResponse.features.length) {
            const startFeature = (featureIndex) => {
                if (featureIndex < this.model.playResponse.features.length) {
                    const feature = this.model.playResponse.features[featureIndex];
                    this.events.once(ApplicationEvent.EndFeature, () => {
                        startFeature(featureIndex + 1);
                    });
                    this.startFeature(feature);
                } else {
                    this.endRound();
                }
            }
            startFeature(0);
        }
    }

    public startShowTotalWin() {
        this.events.emit(ApplicationEvent.StartShowTotalWin);
    }

    public endShowTotalWin() {
        this.events.emit(ApplicationEvent.EndShowTotalWin);
    }

    public startShowWin(win: Win) {
        this.events.emit(ApplicationEvent.StartShowWin, win);
    }

    public endShowWin(win: Win) {
        this.events.emit(ApplicationEvent.EndShowWin, win);
    }

    public startFeature(feature: string) {
        this.events.emit(ApplicationEvent.StartFeature, feature);
    }

    public endFeature(feature: string) {
        this.events.emit(ApplicationEvent.EndFeature, feature);
    }

    protected initScenes() {
        this.scenes.add('preload', new PreloadScene(this))
        this.scenes.add('title', new TitleScene(this))
        this.scenes.add('main', new MainScene(this, this.ui, machineDefinition.features['base']));

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