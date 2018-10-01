import { PlayResponse } from "./modules/client/PlayResponse";
import { Win } from "./modules/client/Win";
import { Bet } from "./modules/bet/Bet";

export interface GameControllerObserver {
    roundStart: () => Promise<void>;
    spinStart: () => Promise<void>;
    slam: () => void;
    spinEnd: (response: PlayResponse) => Promise<void>;
    showTotalWin: (amount: number) => Promise<void>;
    showTotalWinCancel: () => void;
    showWinsStart: () => Promise<void>;
    showWin: (win: Win) => Promise<void>;
    showWinsEnd: () => Promise<void>;
    showWinsCancel: () => void;
    playFeaturesStart: () => Promise<void>;
    playFeature: (feature: string) => Promise<void>;
    playFeaturesEnd: () => Promise<void>;
    roundEnd: () => Promise<void>;
}

export class DefaultGameControllerObserver implements GameControllerObserver {
    public roundStart() {
        return Promise.resolve();
    }
    public spinStart() {
        return Promise.resolve();
    }
    public spinEnd(response: PlayResponse) {
        return Promise.resolve();
    }
    public slam() {
        return;
    }
    public showTotalWin(amount: number) {
        return Promise.resolve();
    }
    public showTotalWinCancel() {
        return;
    }
    public showWinsStart() {
        return Promise.resolve();
    }
    public showWin(win: Win) {
        return Promise.resolve();
    }
    public showWinsEnd() {
        return Promise.resolve();
    }
    public showWinsCancel() {
        return;
    }
    public playFeaturesStart() {
        return Promise.resolve();
    }
    public playFeature(feature: string) {
        return Promise.resolve();
    }
    public playFeaturesEnd() {
        return Promise.resolve();
    }
    public roundEnd() {
        return Promise.resolve();
    }
}

interface GameControllerServices {
    observer: GameControllerObserver,
    play(bet: Bet): Promise<PlayResponse>;
    createBet(credits: number, betsCount: number): Bet;
}

export enum GameControllerState {
    Idle,
    WaitingPlayResponse,
    SpinEnd,
    ShowTotalWin,
    ShowWins,
    PlayFeatures
}

export class GameController {
    protected bet: Bet;
    protected playResponse: PlayResponse;
    protected services: GameControllerServices; 
    protected state: GameControllerState = GameControllerState.Idle;
    protected slamQueued: boolean;
    protected didSlam: boolean;
    protected showTotalWinCancelled: boolean;
    protected showWinsCancelled: boolean;

    constructor(services: GameControllerServices) {
        this.services = services;
        this.bet = this.services.createBet(5, 20);
    }

    public setObserver(observer: GameControllerObserver) {
        this.services.observer = observer;
    }

    protected addListeners() {
    }

    public roundStart() {
        this.playResponse = null;
        this.slamQueued = false;
        this.didSlam = false;
        this.showTotalWinCancelled = false;
        this.showWinsCancelled = false;
        this.state = GameControllerState.WaitingPlayResponse;

        this.services.observer.roundStart().then(() => {
            return Promise.all([
                this.spinStart(),
                this.play()
            ]);
        }).then(([_, response]) => {
            return this.spinEnd(response);
        }).then(() => {
            return this.showResults();
        }).then(() => {
            return this.playFeatures();
        }).then(() => {
            return this.roundEnd();
        }).then(() => {
            this.state = GameControllerState.Idle;
        });
    }

    public spinButtonClick() {
        switch (this.state) {
            case GameControllerState.Idle: 
                this.roundStart();
                break;
            case GameControllerState.WaitingPlayResponse: 
                if (!this.slamQueued) {
                    this.queueSlam();
                }
                break;
            case GameControllerState.SpinEnd: 
                if (!this.didSlam) {
                    this.slam();
                }
                break;
            case GameControllerState.ShowTotalWin: 
                if (!this.showTotalWinCancelled) {
                    this.showTotalWinCancel();
                }
                break;
            case GameControllerState.ShowWins:  
                if (!this.showWinsCancelled) {
                    this.showWinsCancel();
                }
                break;
        }
    }

    public getState() {
        return this.state;
    }

    protected spinStart() {
        return this.services.observer.spinStart();
    }

    protected play() {
        return this.services.play(this.bet);
    }

    protected spinEnd(response: PlayResponse) {
        this.playResponse = response;
        this.state = GameControllerState.SpinEnd;
        if (this.slamQueued) {
            this.slam();
        }
        return this.services.observer.spinEnd(this.playResponse);
    }

    protected queueSlam() {
        console.log('Slam queued');
        this.slamQueued = true;
    }

    protected slam() {
        this.didSlam = true;
        this.services.observer.slam();
    }

    protected showResults() {
        if (this.playResponse.totalWin) {
            this.state = GameControllerState.ShowTotalWin;
            
            return this.services.observer.showTotalWin(this.playResponse.totalWin).then(() => {
                return this.showWins();
            });
        } else {
            return Promise.resolve();
        }
    }

    protected showTotalWin() {
        if (!this.showTotalWinCancelled && this.playResponse.totalWin) {
            this.state = GameControllerState.ShowTotalWin;
            return this.services.observer.showTotalWin(this.playResponse.totalWin);
        } else {
            return Promise.resolve();
        }
    }

    protected showTotalWinCancel() {
        this.showTotalWinCancelled = true;
        this.services.observer.showTotalWinCancel();
    }

    protected getPlayResponseWins() {
        return this.playResponse.results.reduce((wins, result) => wins.concat(result.wins), []);
    }

    protected showWins() {
        if (!this.showTotalWinCancelled) {
            this.state = GameControllerState.ShowWins;
            return this.services.observer.showWinsStart().then(() => {
                return this.getPlayResponseWins().reduce(
                    (promise, win) => promise.then(() => {
                        return this.showWin(win);
                    }), 
                    Promise.resolve() );
    
            }).then(() => {
                return this.services.observer.showWinsEnd();
            });
        } else {
            return Promise.resolve();
        }
    }

    protected showWinsCancel() {
        this.showWinsCancelled = true;
        this.services.observer.showWinsCancel();
    }

    protected showWin(win: Win) {
        return this.services.observer.showWin(win);
    }

    protected playFeatures() {
        if (this.playResponse.features.length) {
            this.state = GameControllerState.PlayFeatures;
            return this.services.observer.playFeaturesStart().then(() => {
                return this.playResponse.features.reduce(
                    (promise, feature) => promise.then(() => {
                        return this.playFeature(feature);
                    }), 
                    Promise.resolve()
                );
            }).then(() => {
                return this.services.observer.playFeaturesEnd();
            });
        } else {
            return Promise.resolve();
        }
    }

    protected playFeature(feature: string) {
        return this.services.observer.playFeature(feature);
    }

    protected roundEnd() {
        return this.services.observer.roundEnd();
    }
}