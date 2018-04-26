import { PlayResponse, Win } from "./modules/client/PlayResponse";
import { Bet } from "./modules/bet/Bet";

export class ApplicationModel {
    public playResponse: PlayResponse;
    public bet: Bet;
    public wins: Win[] = [];
}