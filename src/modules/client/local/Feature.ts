import { PlayResponse } from "../PlayResponse";

export interface Feature {
    execute(response: PlayResponse);
}