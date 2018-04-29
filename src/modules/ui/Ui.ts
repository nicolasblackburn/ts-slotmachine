import { PlayResponse } from "../client/PlayResponse";
import { ApplicationInterface } from "../../ApplicationInterface";
import { ApplicationEventListener } from "../../ApplicationEventListener";
import { Win } from "../client/Win";

export enum UiEvent {
    SpinButtonClick = 'UiEvent.SpinButtonClick'
}

enum SpinButtonState {
    Spin,
    Slam,
    SkipResults,
    Disabled
}

export class Ui implements ApplicationEventListener {
    public spinButton: HTMLDivElement;
    public uiContainer: HTMLDivElement;
    protected application: ApplicationInterface;
    protected spinButtonState: SpinButtonState = SpinButtonState.Spin;
    protected isSpinStartComplete: boolean = false;
    protected isPlayResquestComplete: boolean = false;

    constructor(application: ApplicationInterface) {
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
                this.application.roundStart();
                break;
            case SpinButtonState.Slam: 
                this.application.slam();
                this.spinButtonState = SpinButtonState.Disabled;
                this.update();
                break;
            case SpinButtonState.SkipResults: 
                this.application.skipResults();
                this.spinButtonState = SpinButtonState.Disabled;
                this.update();
                break;
            case SpinButtonState.Disabled: 
                console.log('Spin disabled');
                break;
        }
    }

    public roundStart() {
        this.isPlayResquestComplete = false;
        this.isSpinStartComplete = false;
        this.spinButtonState = SpinButtonState.Disabled;
        this.update();
    }

    public roundEnd() {
        this.spinButtonState = SpinButtonState.Spin;
        this.update();
    }

    public spinStart() {
    }

    public spinStartComplete() {
        this.isSpinStartComplete = true;
        this.updateSlamStateIfReady();
    }

    public spinEndReady() {
    }

    public spinEnd(response: PlayResponse) {
    }

    public slam(response: PlayResponse) {
    }

    public resultsStart(response: PlayResponse) {
        if (!response.features.length && response.totalWin) {
            this.spinButtonState = SpinButtonState.SkipResults;
            this.update();
        }
    }

    public resultsEnd() {
    }

    public skipResults() {
    }

    public playRequestSuccess(response: PlayResponse) {
        this.isPlayResquestComplete = true;
        this.updateSlamStateIfReady();
    }

    public playRequestError(error: Error) {
    }

    public winsStart(response: PlayResponse) {
    }

    public winsEnd() {
    }

    public totalWinStart(response: PlayResponse) {
    }

    public totalWinEnd() {
    }

    public winStart(win: Win) {
    }

    public winEnd() {
    }

    public featureStart(feature: string, response: PlayResponse) {
    }

    public featureEnd() {
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

    protected updateSlamStateIfReady() {
        if (this.isPlayResquestComplete && this.isSpinStartComplete) {   
            this.spinButtonState = SpinButtonState.Slam;
            this.update();
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