import {Scene, SceneEvent} from './Scene';
import { StateManager } from '../states/StateManager';
import { PlayResponse, Win } from '../client/PlayResponse';

export class SceneManager extends StateManager<Scene> {
    protected application: PIXI.Application;

    constructor(application: PIXI.Application) {
        super();
        this.application = application;
    }

    public add(sceneName: string, scene: Scene) {
        scene.visible = false;
        scene.interactive = false;
        this.states.set(sceneName, scene);
        this.application.stage.addChild(scene);
        return scene;
    }

    public setCurrent(sceneName: string, ...args: any[]) {
        const scene = this.states.get(sceneName);
        if (!this.states.has(sceneName)) {
            throw new Error("Scene `" + sceneName + "` does'nt exists");
        } 
        if (this.currentKey() !== sceneName) {
            if (!scene.initialized) {  
                scene.once(SceneEvent.EndLoad, () => {
                    scene.init();
                    this.current().emit(SceneEvent.Init);
                    this.swapCurrentSceneAndEnter(sceneName, scene, ...args);
                });
                scene.load();
            } else {
                this.swapCurrentSceneAndEnter(sceneName, scene, ...args);
            }
        }
        return scene;
    }

    public resize() {
        if (this.current()) {
            this.current().resize();
            this.current().emit(SceneEvent.Resize);
        }
    }

    public update() {
        if (this.current()) {
            this.current().update();
            this.current().emit(SceneEvent.Update);
        }
    }

    public startRound() {
        if (this.current()) {
            this.current().startRound();
        }
    }

    public endRound() {
        if (this.current()) {
            this.current().endRound();
        }
    }

    public startSpin() {
        if (this.current()) {
            this.current().startSpin();
        }
    }

    public endSpin() {
        if (this.current()) {
            this.current().endSpin();
        }
    }

    public playRequestSuccess(response: PlayResponse) {
        if (this.current()) {
            this.current().playRequestSuccess(response);
        }
    }

    public playRequestError(error: Error) {
        if (this.current()) {
            this.current().playRequestError(error);
        }
    }

    public startShowWins(wins: Win[]) {
        if (this.current()) {
            this.current().startShowWins(wins);
        }
    }

    public endShowWins(wins: Win[]) {
        if (this.current()) {
            this.current().endShowWins(wins);
        }
    }

    public startShowTotalWin() {
        if (this.current()) {
            this.current().startShowTotalWin();
        }
    }

    public endShowTotalWin() {
        if (this.current()) {
            this.current().endShowTotalWin();
        }
    }

    public startShowWin(win: Win) {
        if (this.current()) {
            this.current().startShowWin(win);
        }
    }

    public endShowWin(win: Win) {
        if (this.current()) {
            this.current().endShowWin(win);
        }
    }

    public startFeature(feature: string) {
        if (this.current()) {
            this.current().startFeature(feature);
        }
    }

    public endFeature(feature: string) {
        if (this.current()) {
            this.current().endFeature(feature);
        }
    }

    protected swapCurrentSceneAndEnter(sceneName: string, scene: Scene, ...args: any[]) {
        this.application.stage.setChildIndex(scene, this.application.stage.children.length - 1);
        scene.visible = true;
        scene.interactive = true;
        scene.resize();

        let previous = this.currentKey();
        if (this.current()) {
            this.current().visible = false;
            this.current().interactive = false;
            this.current().exit(sceneName, ...args);
            this.events.emit(SceneEvent.Exit, previous, sceneName, ...args);
        } 

        this.pCurrent = sceneName;
        this.current().enter(previous, ...args);
        this.events.emit(SceneEvent.Enter, previous, sceneName, ...args);
    }
}