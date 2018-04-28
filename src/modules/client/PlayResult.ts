import { Win } from "./Win";
import { PlayResultData } from "./PlayResultData";
import { WinData } from "./WinData";
import { PaylineWin } from "./PaylineWin";
import { PaylineWinData } from "./PaylineWinData";

export class PlayResult {
    public totalWin: number;
    public wins: Win[];

    public serialize() {
        return {
            totalWin: this.totalWin,
            wins: this.wins.map(win => win.serialize())
        }
    }

    public unserialize(data: PlayResultData) {
        this.totalWin = data.totalWin;
        this.wins = data.wins.map(winData => {
            return this.unserializeWin(winData);
        });
    }

    protected unserializeWin(winData: WinData) {
        if (winData.className === 'Win') {
            const win = new Win();
            win.deserialize(winData);
            return win;
        } else if  (winData.className === 'PaylineWin') {
            const win = new PaylineWin();
            win.deserialize(winData as PaylineWinData);
            return win;
        }
    }
}
