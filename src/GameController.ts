interface Win {
    amount: number;
}

interface Bet {
    credits: number;
    betsCount: number;
}

interface PlayResponse {
    totalWin: number;
    results: {
        wins: Win[]
    }[];
    features: string[];
}

export interface GameControllerObserver {
    roundStart: () => Promise<void>;
    spinStart: () => Promise<void>;
    slam: () => Promise<void>;
    spinEnd: (response: PlayResponse) => Promise<void>;
    showTotalWin: (amount: number) => Promise<void>;
    showWinsStart: () => Promise<void>;
    showWin: (win: Win) => Promise<void>;
    showWinsEnd: () => Promise<void>;
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
        return Promise.resolve();
    }
    public showTotalWin(amount: number) {
        return Promise.resolve();
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
    play(bet: Bet): Promise<PlayResponse>;
    createBet(credits: number, betsCount: number): Bet;
}

export class GameController {
    protected observer: GameControllerObserver;
    protected bet: Bet;
    protected playResponse: PlayResponse;
    protected services: GameControllerServices; 

    constructor(services: GameControllerServices) {
        this.services = services;
        this.bet = this.services.createBet(5, 20);
        this.setObserver(new DefaultGameControllerObserver());
    }

    public setObserver(observer: GameControllerObserver) {
        this.observer = observer;
    }

    public roundStart() {
        this.playResponse = null;
        this.observer.roundStart().then(() => {
            return Promise.all([
                this.spinStart(),
                this.play()
            ]);
        }).then(([_, response]) => {
            this.playResponse = response;
            return this.spinEnd();
        }).then(() => {
            if (this.playResponse.totalWin) {
                return this.showTotalWin().then(() => {
                    return this.showWins();
                });
            } else {
                return Promise.resolve();
            }
        }).then(() => {
            return this.playFeatures();
        }).then(() => {
            return this.roundEnd();
        });
    }

    protected spinStart() {
        return this.observer.spinStart();
    }

    protected play() {
        return this.services.play(this.bet);
    }

    protected spinEnd() {
        return this.observer.spinEnd(this.playResponse);
    }

    protected showTotalWin() {
        return this.observer.showTotalWin(this.playResponse.totalWin);
    }

    protected getPlayResponseWins() {
        return this.playResponse.results.reduce((wins, result) => wins.concat(result.wins), []);
    }

    protected showWins() {
        return this.observer.showWinsStart().then(() => {
            return this.getPlayResponseWins().reduce(
                (promise, win) => promise.then(() => {
                    return this.showWin(win);
                }), 
                Promise.resolve()
            )
        }).then(() => {
            return this.observer.showWinsEnd();
        });
    }

    protected showWin(win: Win) {
        return this.observer.showWin(win);
    }

    protected playFeatures() {
        return this.observer.playFeaturesStart().then(() => {
            return this.playResponse.features.reduce(
                (promise, feature) => promise.then(() => {
                    return this.playFeature(feature);
                }), 
                Promise.resolve()
            );
        }).then(() => {
            return this.observer.playFeaturesEnd();
        });
    }

    protected playFeature(feature: string) {
        return this.observer.playFeature(feature);
    }

    protected roundEnd() {
        return this.observer.roundEnd();
    }
}