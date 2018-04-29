import { PlayResponse } from "./modules/client/PlayResponse";
import { Win } from "./modules/client/Win";

export interface ApplicationInterface {
    roundStart();
    roundEnd();
    spinStart();
    spinStartComplete();
    spinEndReady();
    spinEnd();
    slam();
    resultsStart();
    resultsEnd();
    skipResults();
    playRequestSuccess(response: PlayResponse);
    playRequestError(error: Error);
    winsStart();
    winsEnd();
    totalWinStart();
    totalWinEnd();
    winStart(win: Win);
    winEnd();
    featureStart(feature: string, response: PlayResponse);
    featureEnd();
}