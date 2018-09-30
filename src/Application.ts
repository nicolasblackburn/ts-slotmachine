import {AbstractApplication} from './AbstractApplication';
import { BootScene } from './scenes/BootScene';
import { LoadingScene, LoadingSceneEvent } from './scenes/LoadingScene';
import { TitleScene } from './scenes/TitleScene';
import { MainScene, MainSceneEvent } from './scenes/MainScene';
import { MachineDefinition } from './modules/machine/MachineDefinition';
import { SlotDefinition } from './modules/machine/SlotDefinition';
import { PlayResponse } from './modules/client/PlayResponse';
import { ApplicationEvent } from './ApplicationEvent';

export class Application extends AbstractApplication {
    protected bootScene: BootScene;
    protected loadingScene: LoadingScene;
    protected titleScene: TitleScene;
    protected mainScene: MainScene;

    constructor(machineDefinition: MachineDefinition) {
        super(machineDefinition);

        const baseDefinition = <SlotDefinition>this.machineDefinition.base;

        this.bet.betsCount = baseDefinition.paylines.length;

        this.loadingScene = new LoadingScene();
        //this.preloadScene.addResource('preload', 'assets/img/preload.json');

        this.titleScene = new TitleScene();

        this.mainScene = new MainScene(baseDefinition)
            .addResource('sprites', 'assets/img/sprites.json')
            .on(MainSceneEvent.SpinStartComplete, () => {
                this.spinStartComplete();
            })
            .on(MainSceneEvent.SpinDelayComplete, () => {
                this.spinDelayComplete();
            })
            .on(MainSceneEvent.SlamComplete, () => {
                this.spinEndComplete();
            })
            .on(MainSceneEvent.SpinEndComplete, () => {
                this.spinEndComplete();
            })
            .on(MainSceneEvent.TotalWinComplete, () => {
                this.totalWinEnd();
            })
            .on(MainSceneEvent.WinComplete, () => {
                this.winEnd();
            });

        this.events
            .on(ApplicationEvent.PlayRequestSuccess, (response) => {
                console.log(response);
            })
            .on(ApplicationEvent.RoundStart, () => {
                this.mainScene.roundStart();
            })
            .on(ApplicationEvent.SpinStart, () => {
                this.mainScene.spinStart();
            })
            .on(ApplicationEvent.Slam, (positions) => {
                this.mainScene.slam(positions);
            })
            .on(ApplicationEvent.SpinEnd, (positions) => {
                this.mainScene.spinEnd(positions);
            })
            .on(ApplicationEvent.TotalWinStart, (response) => {
                this.mainScene.totalWinStart(response);
            })
            .on(ApplicationEvent.WinStart, () => {
                this.mainScene.winStart();
            });

        this.scenes
            .add('loading', this.loadingScene)
            .add('title', this.titleScene)
            .add('main', this.mainScene)
            .setCurrent('loading')
            .on(LoadingSceneEvent.Complete, () => {
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