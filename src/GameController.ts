import { Client } from "./modules/client/Client";
import { Bet } from "./modules/bet/Bet";
import { PlayResponse } from "./modules/client/PlayResponse";
import { Win } from "./modules/client/Win";

export interface GameControllerListener {
    roundStart: () => Promise<void>;
    spinStart: () => Promise<void>;
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

export class BaseGameControllerListener implements GameControllerListener {
    public roundStart() {
        return Promise.resolve();
    }
    public spinStart() {
        return Promise.resolve();
    }
    public spinEnd(response: PlayResponse) {
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

export class GameController {
    protected listener: GameControllerListener;
    protected bet: Bet;
    protected client: Client;
    protected playResponse: PlayResponse;

    constructor(client: Client) {
        this.bet = new Bet(5, 20);
        this.client = client;
        this.setListener(new BaseGameControllerListener());
    }

    public setListener(listener: GameControllerListener) {
        this.listener = listener;
    }

    public start() {
        this.playResponse = null;
        Promise.all([
            this.listener.spinStart(),
            this.client.play(this.bet)
        ]).then(([_, response]) => {
            this.playResponse = response;
            return this.listener.spinEnd(this.playResponse);
        }).then(() => {
            if (this.playResponse.totalWin) {
                return this.listener.showTotalWin(this.playResponse.totalWin).then(() => {
                    let promise = Promise.resolve();
                    const wins = this.playResponse.results.reduce((wins, result) => wins.concat(result.wins), []);
                    for (const win of wins) {
                        promise = promise.then(() => {
                            return this.listener.showWin(win);
                        });
                    }
                    return promise;
                });
            } else {
                return Promise.resolve();
            }
        }).then(() => {
            let promise = Promise.resolve();
            for (const feature of this.playResponse.features) {
                promise = promise.then(() => {
                    return this.listener.playFeature(feature);
                });
            }
            return promise;
        }).then(() => {
            this.listener.roundEnd();
        });
    }
}