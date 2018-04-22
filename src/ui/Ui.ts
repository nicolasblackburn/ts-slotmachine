export enum UiEvent {
    SpinButtonClick = 'UiEvent.SpinButtonClick'
}

export class Ui {
    public spinButton: HTMLDivElement;
    public uiContainer: HTMLDivElement;
    public events: PIXI.utils.EventEmitter;

    constructor() {
        this.events = new PIXI.utils.EventEmitter();

        this.uiContainer = document.createElement('div');
        this.uiContainer.setAttribute('id', 'ui-container');
        this.uiContainer.className = 'hidden';

        this.spinButton = document.createElement('div');
        this.spinButton.setAttribute('id', 'spin-button');
        this.spinButton.className = 'icon_spin';
        this.spinButton.addEventListener('pointerdown', () => this.events.emit(UiEvent.SpinButtonClick));
        this.uiContainer.appendChild(this.spinButton);
    }

    public setVisible(visible: boolean) {
        this.uiContainer.className = this.uiContainer.className.replace(/\bhidden\b/, '');
        if (!visible) {
            this.uiContainer.className += ' hidden';
        }
    }
}