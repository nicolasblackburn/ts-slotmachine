import {Scene} from '../modules/scenes/Scene';

export class TitleScene extends Scene {
    protected textGroup: PIXI.Container;
    protected title: PIXI.Text;
    protected clickText: PIXI.Text;

    public init() {
        this.textGroup = new PIXI.Container();
        this.title = new PIXI.Text('Super Fruity!', {
            fill: 0xffffff,
            fontSize: 64,
            fontWeight: 'bold'
        })
        this.clickText = new PIXI.Text('Click anywhere to continue', {
            fill: 0xffffff,
            fontSize: 24,
            fontWeight: 'normal'
        })
        this.textGroup.addChild(
            this.title,
            this.clickText
        );
        this.addChild(this.textGroup);
    }

    public resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.clickText.position.set(
            (this.title.width - this.clickText.width) * 0.5,
            this.title.height + 0.1 * height
        )

        this.textGroup.position.set(
            (width - this.textGroup.width) * 0.5,
            (height - this.textGroup.height) * 0.5
        );
    }
}