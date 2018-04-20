import {Scene} from '../modules/scenes/Scene';
import {Reel} from '../components/Reel';

export class MainScene extends Scene {
    protected reel: Reel;

    public init() {
        this.reel = new Reel();
        this.addChild(this.reel);
    }
}