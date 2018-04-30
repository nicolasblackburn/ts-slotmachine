import { ApplicationEventAction } from "../ApplicationEventAction";
import { ReelSet } from "../components/reels/ReelSet";
import { ApplicationInterface } from "../ApplicationInterface";
import { PlayResponse } from "../modules/client/PlayResponse";

export class MainSceneApplicationEventAction extends ApplicationEventAction {
    protected reelSet: ReelSet;
    protected application: ApplicationInterface;

    constructor(application: ApplicationInterface, reelSet: ReelSet) {
        super();
        this.application = application;
        this.reelSet = reelSet;
    }
    
    public spinStart() {
        this.reelSet.spinStart()
            .call(() => this.application.spinStartComplete(), null, null, 'SpinStartComplete')
            .eventCallback('onComplete', () => this.application.spinEndReady());
    }

    public playRequestSuccess(response: PlayResponse) {
        console.log(response);
    }

    public slam(positions: number[]) {
        this.spinEnd(positions);
    }

    public spinEnd(positions: number[]) {
        this.reelSet.spinEnd(positions)
            .call(() => this.application.spinEndComplete());
    }
}