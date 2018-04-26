import { ApplicationModel, ApplicationModelEvent } from "../ApplicationModel";

export enum UiEvent {
    SpinButtonClick = 'UiEvent.SpinButtonClick'
}

export class Ui {
    public spinButton: HTMLDivElement;
    public uiContainer: HTMLDivElement;
    public events: PIXI.utils.EventEmitter;
    protected applicationModel: ApplicationModel;

    constructor(applicationModel: ApplicationModel) {
        this.events = new PIXI.utils.EventEmitter();

        this.applicationModel = applicationModel;
        this.applicationModel.events.on(ApplicationModelEvent.Changed, () => this.update());

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
        if (visible) {
            this.removeClass(this.uiContainer, 'hidden');
        } else {
            this.addClass(this.uiContainer, 'hidden');
        }
    }

    public update() {
        this.syncClassWith(this.spinButton, 'enabled', this.applicationModel.canSpin);
    }

    protected syncClassWith(element: HTMLElement, className: string, condition: boolean) {
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