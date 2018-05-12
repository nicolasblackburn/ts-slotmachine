import {AbstractApplication} from './AbstractApplication';
import { PreloadScene, PreloadSceneEvent } from './scenes/PreloadScene';
import { TitleScene } from './scenes/TitleScene';
import { MainScene, MainSceneEvent } from './scenes/MainScene';
import { MachineDefinition } from './modules/machine/MachineDefinition';
import { SlotDefinition } from './modules/machine/SlotDefinition';
import { SpinButtonState, UiEvent } from './modules/ui/Ui';
import { PlayResponse } from './modules/client/PlayResponse';
import { ApplicationEvent } from './ApplicationEvent';

export class Application extends AbstractApplication {
    constructor(machineDefinition: MachineDefinition) {
        super(machineDefinition);

        const baseDefinition = <SlotDefinition>this.machineDefinition.base;

        this.bet.lineCount = baseDefinition.paylines.length;

        this.events.on(ApplicationEvent.PlayRequestSuccess, (response) => {
            console.log(response);
        });

        const mainScene = new MainScene(baseDefinition);
        mainScene.on(MainSceneEvent.SpinStartComplete, () => {
            this.spinStartComplete();
        });
        mainScene.on(MainSceneEvent.SpinDelayComplete, () => {
            this.spinDelayComplete();
        });
        mainScene.on(MainSceneEvent.SlamComplete, () => {
            this.spinEndComplete();
        });
        mainScene.on(MainSceneEvent.SpinEndComplete, () => {
            this.spinEndComplete();
        });
        mainScene.on(MainSceneEvent.TotalWinComplete, () => {
            this.totalWinEnd();
        });
        mainScene.on(MainSceneEvent.WinComplete, () => {
            this.winEnd();
        });
        this.events.on(ApplicationEvent.RoundStart, () => {
            mainScene.roundStart();
        });
        this.events.on(ApplicationEvent.SpinStart, () => {
            mainScene.spinStart();
        });
        this.events.on(ApplicationEvent.Slam, (positions) => {
            mainScene.slam(positions);
        });
        this.events.on(ApplicationEvent.SpinEnd, (positions) => {
            mainScene.spinEnd(positions);
        });
        this.events.on(ApplicationEvent.TotalWinStart, (response) => {
            mainScene.totalWinStart(response);
        });
        this.events.on(ApplicationEvent.WinStart, (win) => {
            mainScene.winStart(win);
        });

        this.scenes.add('preload', new PreloadScene())
        this.scenes.add('title', new TitleScene())
        this.scenes.add('main', mainScene);

    
        /*
        this.scenes
            .get('preload')
            .addResource('preload', 'assets/img/preload.json');
        */

        this.scenes
            .get('main')
            .addResource('sprites', 'assets/img/sprites.json');
    
        this.scenes
            .setCurrent('preload')
            .on(PreloadSceneEvent.Complete, () => {
                this.scenes.setCurrent('title');
    
                this.renderer.plugins.interaction.once('pointerdown', () => {
                    this.scenes.setCurrent('main');
                    this.ui.setVisible(true);
                });
            });
    }

    public playRequestSuccess(response: PlayResponse) {
        super.playRequestSuccess(response);
    }
}