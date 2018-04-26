import { Application, ApplicationEvent } from "../Application";
import { PlayResponse, Win } from "../modules/client/PlayResponse";

export enum UiEvent {
    SpinButtonClick = 'UiEvent.SpinButtonClick'
}

enum SpinButtonState {
    Spin,
    Slam,
    Disabled
}

export class Ui {
    public spinButton: HTMLDivElement;
    public uiContainer: HTMLDivElement;
    protected application: Application;
    protected spinButtonState: SpinButtonState = SpinButtonState.Spin;

    constructor(application: Application) {
        this.application = application;

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
        switch (this.spinButtonState) {
            case SpinButtonState.Spin: 
                this.application.startRound();
                break;
            case SpinButtonState.Slam: 
                //this.application.slam();
                console.log('Slam');
                break;
            case SpinButtonState.Disabled: 
                console.log('Spin disabled');
                break;
        }
    }

    public startRound() {
        this.spinButtonState = SpinButtonState.Disabled;
        this.update();
    }

    public endRound() {
        this.spinButtonState = SpinButtonState.Spin;
        this.update();
    }

    public startSpin() {}

    public endSpin(response: PlayResponse) {
        if (!response.features.length) {
            this.spinButtonState = SpinButtonState.Slam;
            this.update();
        }
    }

    public enableSpin() {
        this.spinButtonState = SpinButtonState.Spin;
        this.update();
    }

    public playRequestSuccess(response: PlayResponse) {
        this.spinButtonState = SpinButtonState.Slam;
        this.update();
    }

    public playRequestError(error: Error) {}

    public startShowWins(wins: Win[]) {}

    public endShowWins() {}

    public startShowTotalWin() {}

    public endShowTotalWin() {}

    public startShowWin(win: Win) {}

    public endShowWin() {}

    public startFeature(feature: string) {}

    public endFeature() {}

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