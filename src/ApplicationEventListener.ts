import { PlayResponse } from "./modules/client/PlayResponse";
import { Win } from "./modules/client/Win";

export interface ApplicationEventListener {
    roundStart();
    roundEnd();
    spinStart();
    spinEndReady();
    spinEnd(response: PlayResponse);
    slam(response: PlayResponse);
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