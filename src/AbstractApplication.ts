import { SceneManager } from './modules/scenes/SceneManager';
import { Ui } from './modules/ui/Ui';
import { Client } from './modules/client/Client';
import { LocalClient } from './modules/client/local/LocalClient';
import { Bet } from './modules/bet/Bet';
import { PlayResponse } from './modules/client/PlayResponse';
import { State } from './modules/states/State';
import { MachineDefinition } from './modules/machine/MachineDefinition';
import { ApplicationInterface } from './ApplicationInterface';
import { ApplicationEvent } from './ApplicationEvent';
import { Win } from './modules/client/Win';
import { SlotResult } from './modules/client/SlotResult';
import { ApplicationEventListener } from './ApplicationEventListener';

export class AbstractApplication extends PIXI.Application implements ApplicationInterface {
    public events: PIXI.utils.EventEmitter;
    public scenes: SceneManager;
    protected bet: Bet;
    protected client: Client;
    protected machineDefinition: MachineDefinition;
    protected playResponse: PlayResponse;
    protected ui: Ui;

    constructor(machineDefinition: MachineDefinition) {
        super({
            width: window && window.innerWidth || 1280,
            height: window && window.innerHeight || 720,
            resolution: window && window.devicePixelRatio || 1
        });

        this.machineDefinition = machineDefinition;
        this.events = new PIXI.utils.EventEmitter();
        this.renderer.backgroundColor = 0x080010;
        this.client = new LocalClient(machineDefinition);
        this.bet = new Bet(5, 1);
        this.ui = new Ui(this);
        this.scenes = new SceneManager(this.stage);

        document.body.appendChild(this.view);
        document.body.appendChild(this.ui.uiContainer);

        this.ticker.add(deltaTime => this.scenes.update());

        this.addApplicationEventListener(this.ui);

        window.addEventListener('resize', () => this.resize());
        
        this.resize();
    }

    public resize() {
        this.renderer.resize(window.innerWidth, window.innerHeight);
        this.renderer.view.style.width = window.innerWidth + 'px';
        this.renderer.view.style.height = window.innerHeight + 'px';
        this.scenes.resize();
    }

    public addApplicationEventListener(listener: ApplicationEventListener) {
        this.events.on(ApplicationEvent.RoundStart, () => listener.roundStart());
        this.events.on(ApplicationEvent.RoundEnd, () => listener.roundEnd());
        this.events.on(ApplicationEvent.SpinStart, () => listener.spinStart());
        this.events.on(ApplicationEvent.SpinStartComplete, () => listener.spinStartComplete());
        this.events.on(ApplicationEvent.SpinEndReady, () => listener.spinEndReady());
        this.events.on(ApplicationEvent.SpinEnd, (positions) => listener.spinEnd(positions));
        this.events.on(ApplicationEvent.SpinEndComplete, () => listener.spinEndComplete());
        this.events.on(ApplicationEvent.Slam, (positions) => listener.slam(positions));
        this.events.on(ApplicationEvent.ResultsStart, (response) => listener.resultsStart(response));
        this.events.on(ApplicationEvent.ResultsEnd, () => listener.resultsEnd());
        this.events.on(ApplicationEvent.SkipResults, () => listener.skipResults());
        this.events.on(ApplicationEvent.PlayRequestSuccess, (response) => listener.playRequestSuccess(response));
        this.events.on(ApplicationEvent.PlayRequestError, (error) => listener.playRequestError(error));
        this.events.on(ApplicationEvent.WinsStart, (response) => listener.winsStart(response));
        this.events.on(ApplicationEvent.WinsEnd, () => listener.winsEnd());
        this.events.on(ApplicationEvent.TotalWinStart, (response) => listener.totalWinStart(response));
        this.events.on(ApplicationEvent.TotalWinEnd, () => listener.totalWinEnd());
        this.events.on(ApplicationEvent.WinStart, (win) => listener.winStart(win));
        this.events.on(ApplicationEvent.WinEnd, () => listener.winEnd());
        this.events.on(ApplicationEvent.FeatureStart, (feature, response) => listener.featureStart(feature, response));
        this.events.on(ApplicationEvent.FeatureEnd, () => listener.featureEnd());
    }

    public roundStart() {
        this.playResponse = null;
        this.events.emit(ApplicationEvent.RoundStart);
        this.spinStart();
    }

    public roundEnd() {
        this.events.emit(ApplicationEvent.RoundEnd);
    }

    public spinStart() {
        this.events.emit(ApplicationEvent.SpinStart);

        let response;
        let requestCompleted = false;
        let spinEndReady = false;

        const trySpinEnd = () => {
            if (requestCompleted && spinEndReady) {
                this.events.removeListener(ApplicationEvent.PlayRequestSuccess, onSuccess);
                this.events.removeListener(ApplicationEvent.PlayRequestError, onError);
                this.events.removeListener(ApplicationEvent.ResultsStart, onSpinEndReady);
                this.spinEnd();
            }
        }

        const onSuccess = (responseReceived) => {
            response = responseReceived;
            requestCompleted = true;
            trySpinEnd();
        }

        const onError = () => {
            requestCompleted = true;
            trySpinEnd();
        }

        const onSpinEndReady = () => {
            spinEndReady = true;
            trySpinEnd();
        }

        this.events.once(ApplicationEvent.PlayRequestSuccess, onSuccess);
        this.events.once(ApplicationEvent.PlayRequestError, onError);
        this.events.once(ApplicationEvent.SpinEndReady, onSpinEndReady);

        this.client.play(this.bet).then(
            response => this.playRequestSuccess(response),
            error => this.playRequestError(error)
        );
    }

    public spinStartComplete() {
        this.events.emit(ApplicationEvent.SpinStartComplete);
    }

    public spinEndReady() {
        this.events.emit(ApplicationEvent.SpinEndReady);
    }

    public spinEnd() {
        const response = this.playResponse;
        const positions = (<SlotResult>response.results[0]).positions;
        this.events.emit(ApplicationEvent.SpinEnd, positions);
    }

    public spinEndComplete() {
        this.events.emit(ApplicationEvent.SpinEndComplete);
        this.resultsStart();
    }

    public slam() {
        const response = this.playResponse;
        const positions = (<SlotResult>response.results[0]).positions;
        this.events.emit(ApplicationEvent.Slam, positions);
    }

    public resultsStart() {
        const response = this.playResponse;
        this.events.emit(ApplicationEvent.ResultsStart, response);
        if (!response) {
            this.resultsEnd();
        } else {
            if (response.totalWin > 0) {
                this.totalWinStart();
            }
            const hasFeatures = !!response.features.length;
            if (!hasFeatures && response.totalWin === 0) {
                this.resultsEnd();
            }
        }
    }

    public resultsEnd() {
        this.events.emit(ApplicationEvent.ResultsEnd);
        this.roundEnd();
    }

    public skipResults() {
        this.events.emit(ApplicationEvent.SkipResults);
    }

    public playRequestSuccess(response: PlayResponse) {
        this.playResponse = response;
        this.events.emit(ApplicationEvent.PlayRequestSuccess, response);
    }

    public playRequestError(error: Error) {
        this.events.emit(ApplicationEvent.PlayRequestSuccess, error);
    }

    public winsStart() {
        const response = this.playResponse;
        this.events.emit(ApplicationEvent.WinsStart, response);

        // Flatten the wins
        const wins = response.results.reduce(
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
        
        const winStart = (winIndex) => {
            if (winIndex < wins.length) {
                const win = wins[winIndex];
                this.events.once(ApplicationEvent.WinEnd, () => {
                    winStart(winIndex + 1);
                });
                this.winStart(win);
            } else {
                this.winsEnd();
            }
        }
        winStart(0);
    }

    public winsEnd() {
        this.events.emit(ApplicationEvent.WinsEnd);
        if (this.playResponse.features.length) {
            const featureStart = (featureIndex) => {
                if (featureIndex < this.playResponse.features.length) {
                    const feature = this.playResponse.features[featureIndex];
                    this.events.once(ApplicationEvent.FeatureEnd, () => {
                        featureStart(featureIndex + 1);
                    });
                    this.featureStart(feature, this.playResponse);
                } else {
                    this.resultsEnd();
                }
            }
            featureStart(0);
        } else {
            this.resultsEnd();
        }
    }

    public totalWinStart() {
        const response = this.playResponse;
        this.events.emit(ApplicationEvent.TotalWinStart, response);
    }

    public totalWinEnd() {
        this.events.emit(ApplicationEvent.TotalWinEnd);
        this.winsStart();
    }

    public winStart(win: Win) {
        console.log(win);
        this.events.emit(ApplicationEvent.WinStart, win);
    }

    public winEnd() {
        this.events.emit(ApplicationEvent.WinEnd);
    }

    public featureStart(feature: string, response: PlayResponse) {
        this.events.emit(ApplicationEvent.FeatureStart, feature, response);
    }

    public featureEnd() {
        this.events.emit(ApplicationEvent.FeatureEnd);
    }
}