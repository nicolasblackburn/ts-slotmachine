import {Scene} from '../modules/scenes/Scene';
import {ProgressBar} from '../components/ProgressBar';
import {TweenLite} from 'gsap';

export enum PreloadSceneEvent {
    Complete = 'PreloadSceneEvent.Complete'
}

export class PreloadScene extends Scene {
    protected progressBar: ProgressBar;

    public init() {
        super.init();
        this.progressBar = new ProgressBar();
        this.progressBar.progress = 0;
        this.addChild(this.progressBar);

        new TweenLite(this.progressBar, 1, {
            progress: 1,
            onComplete: () => {
                this.events.emit(PreloadSceneEvent.Complete);
            }
        });
    }

    public resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.progressBar.width = width * 0.75;

        this.progressBar.position.set(
            (width - this.progressBar.width) * 0.5,
            (height - this.progressBar.height) * 0.66
        );
    }
}