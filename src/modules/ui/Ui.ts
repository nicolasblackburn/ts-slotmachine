import { SpinButtonState } from "./SpinButtonState";
import { UiEvent } from "./UiEvent";

export class Ui extends PIXI.Container {
    public spinButton: HTMLDivElement;
    public uiContainer: HTMLDivElement;
    public spinButtonState: SpinButtonState = SpinButtonState.Spin;

    constructor() {
        super();

        this.uiContainer = document.createElement('div');
        this.uiContainer.setAttribute('id', 'ui-container');
        this.uiContainer.className = 'hidden';

        this.spinButton = document.createElement('div');
        this.spinButton.setAttribute('id', 'spin-button');
        this.spinButton.className = 'icon_spin';
        this.spinButton.addEventListener('pointerdown', () => this.spinButtonClick());
        this.uiContainer.appendChild(this.spinButton);
    }

    public setVisible(visible: boolean) {
        if (visible) {
            this.removeClass(this.uiContainer, 'hidden');
        } else {
            this.addClass(this.uiContainer, 'hidden');
        }
    }

    public spinButtonClick() {
        this.emit(UiEvent.SpinButtonClick);
    }

    public update() {
        this.removeClass(this.spinButton, 'disabled');
        this.removeClass(this.spinButton, 'action-slam');
        this.removeClass(this.spinButton, 'action-spin');
        switch (this.spinButtonState) {
            case SpinButtonState.Spin: 
                this.addClass(this.spinButton, 'action-spin');
                break;
            case SpinButtonState.Slam: 
                this.addClass(this.spinButton, 'action-slam');
                break;
            case SpinButtonState.Disabled: 
                this.addClass(this.spinButton, 'disabled');
                break;
        }
    }

    protected setClassIf(element: HTMLElement, className: string, condition: boolean) {
        if (condition) {
            this.addClass(element, className);
        } else {
            this.removeClass(element, className);
        }
    }

    protected addClass(element: HTMLElement, className: string) {
        const re = new RegExp('\\b' + className + '\\b', 'i');
        if (!element.className.match(re)) {
            element.className += (element.className ? ' ' : '') + className;
        }
    }

    protected removeClass(element: HTMLElement, className: string) {
        const re = new RegExp('\\b' + className + '\\b', 'i');
        element.className = element.className.replace(re, '');
    }
}