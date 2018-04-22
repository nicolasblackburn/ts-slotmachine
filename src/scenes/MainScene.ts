import {Scene} from '../modules/scenes/Scene';
import {ReelSet} from '../components/ReelSet';
import { Ui } from '../ui/Ui';

export class MainScene extends Scene {
    protected reelSet: ReelSet;
    protected ui: Ui;

    constructor(ui: Ui) {
        super();
        this.ui = ui;
    }

    public init() {
        this.reelSet = new ReelSet();
        this.addChild(this.reelSet);
    }

    public show() {
        this.ui.setVisible(true);
    }
    
    public resize() {
        this.resizeReelSet();
    }

    public resizeReelSet() {
        this.reelSet.height = window.innerHeight * 0.8;
        this.reelSet.scale.x = this.reelSet.scale.y;
        this.reelSet.x = (window.innerWidth - this.reelSet.width) * 0.5;
        this.reelSet.y = window.innerHeight * 0.1;
    }
}