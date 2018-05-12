import { Scene } from '../modules/scenes/Scene';
import { ReelSet } from '../components/reels/ReelSet';
import { SlotDefinition } from '../modules/machine/SlotDefinition';
import { PlayResponse } from '../modules/client/PlayResponse';
import { NumberSprite } from '../components/NumberSprite';
import * as gsap from 'gsap';


export enum MainSceneEvent {
    SpinStartComplete = 'MainSceneEvent.SpinStartComplete',
    SpinDelayComplete = 'MainSceneEvent.SpinDelayComplete',
    SlamComplete = 'MainSceneEvent.SlamComplete',
    SpinEndComplete = 'MainSceneEvent.SpinEndComplete',
    TotalWinComplete = 'MainSceneEvent.TotalWinComplete',
    WinComplete = 'MainSceneEvent.WinComplete'
}

export class MainScene extends Scene {
    protected reelSet: ReelSet;
    protected slotDefinition: SlotDefinition;
    protected numberSprite: NumberSprite;

    constructor(slotDefinition: SlotDefinition) {
        super();
        this.slotDefinition = slotDefinition;
    }

    public init() {
        this.numberSprite = new NumberSprite();
        this.numberSprite.visible = false;
        this.numberSprite.value = '0.00';

        this.reelSet = new ReelSet(this.slotDefinition);
        (window as any).reelSet = this.reelSet;

        this.addChild(this.reelSet);
        this.addChild(this.numberSprite);
    }

    public resize() {
        this.resizeReelSet();
    }

    public update() {
        this.reelSet.update();
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
        if (this.active) {
            this.reelSet.spinStart()
                .call(() => this.emit(MainSceneEvent.SpinStartComplete))
                .to({}, .86, {})
                .call(() => this.emit(MainSceneEvent.SpinDelayComplete));
        }
    }

    public slam(positions: number[]) {
        if (!this.active) {
            return;
        }
        this.reelSet
            .slam(positions)
            .call(() => this.emit(MainSceneEvent.SlamComplete));
    }

    public spinEnd(positions: number[]) {
        if (!this.active) {
            return;
        }
        this.reelSet.spinEnd(positions)
            .call(() => this.emit(MainSceneEvent.SpinEndComplete));
    }

    public totalWinStart(response: PlayResponse) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (response.totalWin) {
            const timeline = new gsap.TimelineLite();
    
            const tween = {value: 0};
            timeline
                .call(() => {
                    this.numberSprite.visible = true;
                    this.numberSprite.value = (0).toFixed(2);
                    this.numberSprite.x = width / 2;
                    this.numberSprite.y = height / 2;
                    this.numberSprite.scale.set(0);
                })
                .to(this.numberSprite.scale, 0.2, {x: 1, y: 1})
                .to(tween, 0.5, {value: response.totalWin, onUpdate: () => {
                    this.numberSprite.value = tween.value.toFixed(2);
                }}, 0)
                .to({}, 1, {})
                .to(this.numberSprite.scale, 0.2, {x: 0, y: 0})
                .call(() => this.emit(MainSceneEvent.TotalWinComplete));
        }
    }

    public winStart() {
        this.emit(MainSceneEvent.WinComplete);
    }

    protected resizeReelSet() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.reelSet.height = height * 0.8;
        this.reelSet.scale.x = this.reelSet.scale.y;

        if (this.reelSet.width > width * 0.95) {
            this.reelSet.width = width * 0.95;
            this.reelSet.scale.y = this.reelSet.scale.x;
        }

        this.reelSet.x = (width - this.reelSet.width) * 0.5;
        this.reelSet.y = (height - this.reelSet.height) * 0.5;
        
        this.numberSprite.x = (width - this.numberSprite.width) / 2;
        this.numberSprite.y = (height + this.numberSprite.height) / 2;
    }
}