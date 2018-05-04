import { ApplicationEventAction } from "../ApplicationEventAction";
import { ReelSet } from "../components/reels/ReelSet";
import { ApplicationInterface } from "../ApplicationInterface";
import { PlayResponse } from "../modules/client/PlayResponse";
import { ReelSetLabel } from "../components/reels/ReelSetLabel";
import { NumberSprite } from "../components/NumberSprite";
import * as gsap from 'gsap';

export class MainSceneApplicationEventAction extends ApplicationEventAction {
    public active: boolean = false;
    protected reelSet: ReelSet;
    protected application: ApplicationInterface;
    protected numberSprite: NumberSprite;

    constructor(application: ApplicationInterface, reelSet: ReelSet, numberSprite: NumberSprite) {
        super();
        this.application = application;
        this.reelSet = reelSet;
        this.numberSprite = numberSprite;
    }

    public roundStart() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.numberSprite.visible = false;
        this.numberSprite.value = (0).toFixed(2);
        this.numberSprite.x = (width - this.numberSprite.width) / 2;
        this.numberSprite.y = (height + this.numberSprite.height) / 2;
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

    public resultsStart() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.numberSprite.visible = true;
        this.numberSprite.value = (0).toFixed(2);
        this.numberSprite.x = (width - this.numberSprite.width) / 2;
        this.numberSprite.y = (height + this.numberSprite.height) / 2;

        const timeline = new gsap.TimelineLite();

        const tween = {value: 0};
        timeline
            .to(tween, 0.5, {value: 100, onUpdate: () => {
                this.numberSprite.value = tween.value.toFixed(2);
                this.numberSprite.x = (width - this.numberSprite.width) / 2;
                this.numberSprite.y = (height + this.numberSprite.height) / 2;
            }});
    }

    public resultsEnd() {
    }
}