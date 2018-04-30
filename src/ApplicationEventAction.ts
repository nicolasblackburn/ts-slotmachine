import { ApplicationEventListener } from './ApplicationEventListener';
import { PlayResponse } from './modules/client/PlayResponse';
import { Win } from './modules/client/Win';

export abstract class ApplicationEventAction implements ApplicationEventListener {
    public roundStart() {}
    public roundEnd() {}
    public spinStart() {}
    public spinStartComplete() {}
    public spinEndReady() {}
    public spinEnd(positions: number[]) {}
    public spinEndComplete() {}
    public slam(position: number[]) {}
    public resultsStart(response: PlayResponse) {}
    public resultsEnd() {}
    public skipResults() {}
    public playRequestSuccess(response: PlayResponse) {}
    public playRequestError(error: Error) {}
    public winsStart(response: PlayResponse) {}
    public winsEnd() {}
    public totalWinStart(response: PlayResponse) {}
    public totalWinEnd() {}
    public winStart(win: Win) {}
    public winEnd() {}
    public featureStart(feature: string, response: PlayResponse) {}
    public featureEnd() {}
}