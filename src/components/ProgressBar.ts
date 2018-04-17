export class ProgressBar extends PIXI.Container {
    protected background: PIXI.Graphics;
    protected foreground: PIXI.Graphics;
    protected propProgress: number = 0;

    constructor() {
        super();

        this.background = new PIXI.Graphics();
        this.background.beginFill(0x000000);
        this.background.drawRect(0, 0, 256, 24);
        this.background.endFill();

        this.foreground = new PIXI.Graphics();
        this.foreground.beginFill(0xffcc33);
        this.foreground.drawRect(0, 0, 256, 24);
        this.foreground.endFill();

        this.addChild(
            this.background,
            this.foreground
        );

        this.progress = 0;
    }

    get progress() {
        return this.propProgress;
    }

    set progress(progress: number) {
        this.propProgress = progress;
        this.foreground.width = this.background.width * progress;
    }
}