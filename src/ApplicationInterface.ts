import { PlayResponse } from "./modules/client/PlayResponse";
import { Win } from "./modules/client/Win";
import { ApplicationEventAction } from "./ApplicationEventAction";

export interface ApplicationInterface {
    addApplicationEventListener(listener: ApplicationEventAction);
    roundStart();
    roundEnd();
    spinStart();
    spinStartComplete();
    spinEndReady();
    spinEnd();
    spinEndComplete();
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