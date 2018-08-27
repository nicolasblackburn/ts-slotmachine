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
        this.spinStart();
    }

    public roundEnd() {
        this.ui.spinButtonState = SpinButtonState.Spin;
        this.ui.update();
    }

    public spinStart() {
        let requestCompleted = false;
        let spinDelayComplete = false;

        const trySpinEnd = () => {
            if (requestCompleted && spinDelayComplete) {
                this.resultsStart();
            }
        }

        this.client.play(this.bet).then(
            response => {
                requestCompleted = true;
                this.playResponse = response;
                this.updateSlamStateIfReady();
                trySpinEnd();
            },
            error => this.error(error)
        );

        if (typeof (this.scenes.current() as any).spinStart === 'function') {
            (this.scenes.current() as any).spinStart().then(() => {
                spinDelayComplete = true;
                trySpinEnd();
            });
        }
    }

    public slam() {
        const response = this.playResponse;
        const positions = (<SlotResult>response.results[0]).positions;
    }

    public resultsStart() {
        const response = this.playResponse;
        if (response && !response.features.length && response.totalWin) {
            this.ui.spinButtonState = SpinButtonState.SkipResults;
            this.ui.update();
        }
        if (!response) {
            this.roundEnd();
        } else if (response.totalWin > 0) {
            this.showTotalWin();
        } else if (response.features.length > 0) {
            console.log('Show features');
        } else {
            this.roundEnd();
        }
    }

    public winsStart() {
        const response = this.playResponse;

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
                /*
                this.events.once(ApplicationEvent.WinEnd, () => {
                    winStart(winIndex + 1);
                });
                */
                this.winStart(win);
            } else {
                this.winsEnd();
            }
        }
        winStart(0);
    }

    public winsEnd() {
        if (this.playResponse.features.length) {
            const featureStart = (featureIndex) => {
                if (featureIndex < this.playResponse.features.length) {
                    const feature = this.playResponse.features[featureIndex];
                    /*
                    this.events.once(ApplicationEvent.FeatureEnd, () => {
                        featureStart(featureIndex + 1);
                    });
                    */
                    this.featureStart(feature, this.playResponse);
                } else {
                    this.roundEnd();
                }
            }
            featureStart(0);
        } else {
            this.roundEnd();
        }
    }

    public showTotalWin() {
        const response = this.playResponse;
    }

    public totalWinEnd() {
        this.winsStart();
    }

    public winStart(win: Win) {
        console.log(win);
    }

    public winEnd() {
    }

    public featureStart(feature: string, response: PlayResponse) {
    }

    public featureEnd() {
    }

    protected skipResults() {
        
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

    protected error(error: Error) {
        throw error;
    }
}