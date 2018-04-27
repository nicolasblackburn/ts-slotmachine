import { SceneManager } from './scenes/SceneManager';
import { Ui } from '../ui/Ui';
import { Client } from './client/Client';
import { LocalClient } from './client/local/LocalClient';
import { Bet } from './bet/Bet';
import { PlayResponse, Win } from './client/PlayResponse';
import { State } from './states/State';
import { MachineDefinition } from './machine/MachineDefinition';

/**
 * Order of events:
 * RoundStart
 *     SpinStart
 *         PlayRequestSuccess | PlayRequestError
 *         SpinEndReady
 *     SpinEnd
 *     ResultsStart
 *         TotalWinStart
 *         TotalWinEnd
 *         WinsStart
 *             WinStart
 *             WinEnd
 *         WinsEnd
 *         FeatureStart
 *         FeatureEnd
 *     ResultsEnd
 * RoundEnd
 */
export enum ApplicationEvent {
    RoundStart = 'ApplicationEvent.RoundStart',
    RoundEnd = 'ApplicationEvent.RoundEnd',
    SpinStart = 'ApplicationEvent.SpinStart',
    SpinEnd = 'ApplicationEvent.SpinEnd',
    Slam = 'ApplicationEvent.Slam',
    ResultsStart = 'ApplicationEvent.ResultsStart',
    ResultsEnd = 'ApplicationEvent.ResultsEnd',
    SkipResults = 'ApplicationEvent.SkipResults',
    PlayRequestSuccess = 'ApplicationEvent.PlayRequestSuccess',
    PlayRequestError = 'ApplicationEvent.PlayRequestError', 
    SpinEndReady = 'ApplicationEvent.SpinEndReady',
    WinsStart = 'ApplicationEvent.WinsStart',
    WinsEnd = 'ApplicationEvent.WinsEnd',
    TotalWinStart = 'ApplicationEvent.TotalWinStart',
    TotalWinEnd = 'ApplicationEvent.TotalWinEnd',
    WinStart = 'ApplicationEvent.WinStart',
    WinEnd = 'ApplicationEvent.WinEnd',
    FeatureStart = 'ApplicationEvent.FeatureStart',
    FeatureEnd = 'ApplicationEvent.FeatureEnd',
}

export interface ApplicationEventListener {
    roundStart();
    roundEnd();
    spinStart();
    spinEndReady();
    spinEnd();
    slam();
    resultsStart(response: PlayResponse);
    resultsEnd();
    skipResults();
    playRequestSuccess(response: PlayResponse);
    playRequestError(error: Error);
    winsStart(response: PlayResponse);
    winsEnd();
    totalWinStart(response: PlayResponse);
    totalWinEnd();
    winStart(win: Win);
    winEnd();
    featureStart(feature: string, response: PlayResponse);
    featureEnd();
}

export class Application extends PIXI.Application implements ApplicationEventListener {
    public events: PIXI.utils.EventEmitter;
    protected bet: Bet;
    protected client: Client;
    protected machineDefinition: MachineDefinition;
    protected playResponse: PlayResponse;
    protected scenes: SceneManager;
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
        document.body.appendChild(this.view);

        this.client = new LocalClient(machineDefinition);

        this.bet = new Bet(5, machineDefinition.base.paylines.length);

        this.ui = new Ui(this);
        document.body.appendChild(this.ui.uiContainer);

        this.scenes = new SceneManager(this);
        this.ticker.add(deltaTime => this.scenes.update());

        this.events.on(ApplicationEvent.RoundStart, () => this.scenes.roundStart());
        this.events.on(ApplicationEvent.RoundEnd, () => this.scenes.roundEnd());
        this.events.on(ApplicationEvent.SpinStart, () => this.scenes.spinStart());
        this.events.on(ApplicationEvent.SpinEndReady, () => this.scenes.spinEndReady());
        this.events.on(ApplicationEvent.SpinEnd, () => this.scenes.spinEnd());
        this.events.on(ApplicationEvent.Slam, () => this.scenes.slam());
        this.events.on(ApplicationEvent.ResultsStart, (response) => this.scenes.resultsStart(response));
        this.events.on(ApplicationEvent.ResultsEnd, () => this.scenes.resultsEnd());
        this.events.on(ApplicationEvent.SkipResults, () => this.scenes.skipResults());
        this.events.on(ApplicationEvent.PlayRequestSuccess, (response) => this.scenes.playRequestSuccess(response));
        this.events.on(ApplicationEvent.PlayRequestError, (error) => this.scenes.playRequestError(error));
        this.events.on(ApplicationEvent.WinsStart, (response) => this.scenes.winsStart(response));
        this.events.on(ApplicationEvent.WinsEnd, () => this.scenes.winsEnd());
        this.events.on(ApplicationEvent.TotalWinStart, (response) => this.scenes.totalWinStart(response));
        this.events.on(ApplicationEvent.TotalWinEnd, () => this.scenes.totalWinEnd());
        this.events.on(ApplicationEvent.WinStart, (win) => this.scenes.winStart(win));
        this.events.on(ApplicationEvent.WinEnd, () => this.scenes.winEnd());
        this.events.on(ApplicationEvent.FeatureStart, (feature, response) => this.scenes.featureStart(feature, response));
        this.events.on(ApplicationEvent.FeatureEnd, () => this.scenes.featureEnd());

        this.events.on(ApplicationEvent.RoundStart, () => this.ui.roundStart());
        this.events.on(ApplicationEvent.RoundEnd, () => this.ui.roundEnd());
        this.events.on(ApplicationEvent.SpinStart, () => this.ui.spinStart());
        this.events.on(ApplicationEvent.SpinEndReady, () => this.ui.spinEndReady());
        this.events.on(ApplicationEvent.SpinEnd, () => this.ui.spinEnd());
        this.events.on(ApplicationEvent.Slam, () => this.ui.slam());
        this.events.on(ApplicationEvent.ResultsStart, (response) => this.ui.resultsStart(response));
        this.events.on(ApplicationEvent.ResultsEnd, () => this.ui.resultsEnd());
        this.events.on(ApplicationEvent.SkipResults, () => this.scenes.skipResults());
        this.events.on(ApplicationEvent.PlayRequestSuccess, (response) => this.ui.playRequestSuccess(response));
        this.events.on(ApplicationEvent.PlayRequestError, (error) => this.ui.playRequestError(error));
        this.events.on(ApplicationEvent.WinsStart, (response) => this.ui.winsStart(response));
        this.events.on(ApplicationEvent.WinsEnd, () => this.ui.winsEnd());
        this.events.on(ApplicationEvent.TotalWinStart, (response) => this.ui.totalWinStart(response));
        this.events.on(ApplicationEvent.TotalWinEnd, () => this.ui.totalWinEnd());
        this.events.on(ApplicationEvent.WinStart, (win) => this.ui.winStart(win));
        this.events.on(ApplicationEvent.WinEnd, () => this.ui.winEnd());
        this.events.on(ApplicationEvent.FeatureStart, (feature, response) => this.ui.featureStart(feature, response));
        this.events.on(ApplicationEvent.FeatureEnd, () => this.ui.featureEnd());

        window.addEventListener('resize', () => this.resize());

        this.init();

        this.resize();
    }

    public resize() {
        this.renderer.resize(window.innerWidth, window.innerHeight);
        this.scenes.resize();
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

        const onSuccess = () => {
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

    public spinEndReady() {
        this.events.emit(ApplicationEvent.SpinEndReady);
    }

    public spinEnd() {
        this.events.emit(ApplicationEvent.SpinEnd);
        this.resultsStart(this.playResponse);
    }

    public slam() {
        this.events.emit(ApplicationEvent.Slam);
    }

    public resultsStart(response: PlayResponse) {
        this.events.emit(ApplicationEvent.ResultsStart, response);
        if (response.totalWin > 0) {
            this.totalWinStart(response);
        }
        const hasFeatures = !!response.features.length;
        if (!hasFeatures && response.totalWin === 0) {
            this.resultsEnd();
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

    public winsStart(response: PlayResponse) {
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
        }
    }

    public totalWinStart(response: PlayResponse) {
        this.events.emit(ApplicationEvent.TotalWinStart, response);
    }

    public totalWinEnd() {
        this.events.emit(ApplicationEvent.TotalWinEnd);
        this.winsStart(this.playResponse);
    }

    public winStart(win: Win) {
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

    protected init() {}
}