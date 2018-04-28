import { PlayResponse, Win } from "./modules/client/PlayResponse";

export interface ApplicationInterface {
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