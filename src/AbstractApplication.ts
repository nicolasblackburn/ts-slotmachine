import { SceneManager } from './modules/scenes/SceneManager';
import { Ui } from './modules/ui/Ui';
import { Client } from './modules/client/Client';
import { LocalClient } from './modules/client/local/LocalClient';
import { Bet } from './modules/bet/Bet';
import { PlayResponse } from './modules/client/PlayResponse';
import { MachineDefinition } from './modules/machine/MachineDefinition';
import { ApplicationEvent } from './ApplicationEvent';
import { Win } from './modules/client/Win';
import { SlotResult } from './modules/client/SlotResult';
import { UiEvent } from './modules/ui/UiEvent';
import { SpinButtonState } from './modules/ui/SpinButtonState';

export class AbstractApplication extends PIXI.Application {
    public events: PIXI.utils.EventEmitter;
    public scenes: SceneManager;
    protected bet: Bet;
    protected client: Client;
    protected machineDefinition: MachineDefinition;
    protected playResponse: PlayResponse;
    protected ui: Ui;
    protected isSpinStartComplete: boolean = false;

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
        this.ui = new Ui();
        this.scenes = new SceneManager(this.stage);

        document.body.appendChild(this.view);
        document.body.appendChild(this.ui.uiContainer);

        this.ticker.add(() => this.scenes.update());

        window.addEventListener('resize', () => this.resize());

        this.ui.events.on(UiEvent.SpinButtonClick, () => {
            this.spinButtonClick();
        });
        
        this.resize();
    }

    public resize() {
        this.renderer.resize(window.innerWidth, window.innerHeight);
        this.renderer.view.style.width = window.innerWidth + 'px';
        this.renderer.view.style.height = window.innerHeight + 'px';
        this.scenes.resize();
    }

    public roundStart() {
        this.playResponse = null;
        this.isSpinStartComplete = false;
        this.ui.spinButtonState = SpinButtonState.Disabled;
        this.ui.update();
        this.events.emit(ApplicationEvent.RoundStart);
        this.spinStart();
    }

    public roundEnd() {
        this.ui.spinButtonState = SpinButtonState.Spin;
        this.ui.update();
        this.events.emit(ApplicationEvent.RoundEnd);
    }

    public spinStart() {
        this.events.emit(ApplicationEvent.SpinStart);

        let requestCompleted = false;
        let spinDelayComplete = false;

        const trySpinEnd = () => {
            if (requestCompleted && spinDelayComplete) {
                this.events.removeListener(ApplicationEvent.PlayRequestSuccess, onSuccess);
                this.events.removeListener(ApplicationEvent.PlayRequestError, onError);
                this.events.removeListener(ApplicationEvent.ResultsStart, onSpinDelayComplete);
                this.spinEnd();
            }
        }

        const onSuccess = () => {
            requestCompleted = true;
            trySpinEnd();
        }

        const onError = () => {
            requestCompleted = true;
            trySpinEnd();
        }

        const onSpinDelayComplete = () => {
            spinDelayComplete = true;
            trySpinEnd();
        }

        this.events.once(ApplicationEvent.PlayRequestSuccess, onSuccess);
        this.events.once(ApplicationEvent.PlayRequestError, onError);
        this.events.once(ApplicationEvent.SpinDelayComplete, onSpinDelayComplete);

        this.client.play(this.bet).then(
            response => this.playRequestSuccess(response),
            error => this.playRequestError(error)
        );
    }

    public spinDelayComplete() {
        this.events.emit(ApplicationEvent.SpinDelayComplete);
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
        if (response && !response.features.length && response.totalWin) {
            this.ui.spinButtonState = SpinButtonState.SkipResults;
            this.ui.update();
        }
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
        this.updateSlamStateIfReady();
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

    protected spinStartComplete() {
        this.isSpinStartComplete = true;
        this.updateSlamStateIfReady();
    }

    protected updateSlamStateIfReady() {
        if (this.playResponse && this.isSpinStartComplete) {   
            this.ui.spinButtonState = SpinButtonState.Slam;
            this.ui.update();
        }
    }

    protected spinButtonClick() {
        switch (this.ui.spinButtonState) {
            case SpinButtonState.Spin: 
                this.roundStart();
                break;
            case SpinButtonState.Slam: 
                this.slam();
                this.ui.spinButtonState = SpinButtonState.Disabled;
                this.ui.update();
                break;
            case SpinButtonState.SkipResults: 
                this.skipResults();
                this.ui.spinButtonState = SpinButtonState.Disabled;
                this.ui.update();
                break;
            case SpinButtonState.Disabled: 
                console.log('Spin disabled');
                break;
        }
    }
}