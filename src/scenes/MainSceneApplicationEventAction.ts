import { ApplicationEventAction } from "../ApplicationEventAction";
import { ReelSet } from "../components/reels/ReelSet";
import { ApplicationInterface } from "../ApplicationInterface";
import { PlayResponse } from "../modules/client/PlayResponse";
import { ReelSetLabel } from "../components/reels/ReelSetLabel";

export class MainSceneApplicationEventAction extends ApplicationEventAction {
    public active: boolean = false;
    protected reelSet: ReelSet;
    protected application: ApplicationInterface;

    constructor(application: ApplicationInterface, reelSet: ReelSet) {
        super();
        this.application = application;
        this.reelSet = reelSet;
    }
    
    public spinStart() {
        if (!this.active) {
            return;
        }
        this.reelSet.spinStart()
            .call(() => this.application.spinStartComplete(), null, null, ReelSetLabel.SpinStartComplete)
            .eventCallback('onComplete', () => this.application.spinEndReady());
    }

    public playRequestSuccess(response: PlayResponse) {
        console.log(response);
    }

    public slam(positions: number[]) {
        if (!this.active) {
            return;
        }
        this.reelSet
            .slam(positions)
            .call(() => this.application.spinEndComplete());
    }

    public spinEnd(positions: number[]) {
        if (!this.active) {
            return;
        }
        this.reelSet.spinEnd(positions)
            .call(() => this.application.spinEndComplete());
    }
}