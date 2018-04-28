import {Scene} from './Scene';
import { StateManager } from '../states/StateManager';
import { PlayResponse, Win } from '../client/PlayResponse';
import { ApplicationInterface } from '../../ApplicationInterface';
import { SceneEvent } from './SceneEvent';

export class SceneManager extends StateManager<Scene> implements ApplicationInterface {
    protected stage: PIXI.Container;

    constructor(stage: PIXI.Container) {
        super();
        this.stage = stage;
    }

    public add(sceneName: string, scene: Scene) {
        scene.visible = false;
        scene.interactive = false;
        this.states.set(sceneName, scene);
        this.stage.addChild(scene);
        return scene;
    }

    public setCurrent(sceneName: string, ...args: any[]) {
        const scene = this.states.get(sceneName);
        if (!this.states.has(sceneName)) {
            throw new Error("Scene `" + sceneName + "` does'nt exists");
        } 
        if (this.currentKey() !== sceneName) {
            if (!scene.initialized) {  
                scene.once(SceneEvent.LoadEnd, () => {
                    scene.init();
                    scene.emit(SceneEvent.Init);
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

    public roundStart() {
        if (this.current()) {
            this.current().roundStart();
        }
    }

    public roundEnd() {
        if (this.current()) {
            this.current().roundEnd();
        }
    }

    public spinStart() {
        if (this.current()) {
            this.current().spinStart();
        }
    }

    public spinEnd() {
        if (this.current()) {
            this.current().spinEnd();
        }
    }

    public slam() {
        if (this.current()) {
            this.current().slam();
        }
    }

    public spinEndReady() {
        if (this.current()) {
            this.current().spinEndReady();
        }
    }

    public resultsStart(response: PlayResponse) {
        if (this.current()) {
            this.current().resultsStart(response);
        }
    }

    public resultsEnd() {
        if (this.current()) {
            this.current().resultsEnd();
        }
    }

    public skipResults() {
        if (this.current()) {
            this.current().skipResults();
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

    public winsStart(response: PlayResponse) {
        if (this.current()) {
            this.current().winsStart(response);
        }
    }

    public winsEnd() {
        if (this.current()) {
            this.current().winsEnd();
        }
    }

    public totalWinStart(response: PlayResponse) {
        if (this.current()) {
            this.current().totalWinStart(response);
        }
    }

    public totalWinEnd() {
        if (this.current()) {
            this.current().totalWinEnd();
        }
    }

    public winStart(win: Win) {
        if (this.current()) {
            this.current().winStart(win);
        }
    }

    public winEnd() {
        if (this.current()) {
            this.current().winEnd();
        }
    }

    public featureStart(feature: string, response: PlayResponse) {
        if (this.current()) {
            this.current().featureStart(feature, response);
        }
    }

    public featureEnd() {
        if (this.current()) {
            this.current().featureEnd();
        }
    }

    protected swapCurrentSceneAndEnter(sceneName: string, scene: Scene, ...args: any[]) {
        this.stage.setChildIndex(scene, this.stage.children.length - 1);
        scene.visible = true;
        scene.interactive = true;
        scene.resize();

        let previous = this.currentKey();
        if (this.current()) {
            this.current().visible = false;
            this.current().interactive = false;
            this.current().emit(SceneEvent.Exit, sceneName, ...args);
            this.current().exit(sceneName, ...args);
            this.events.emit(SceneEvent.Exit, previous, sceneName, ...args);
        } 

        this.pCurrent = sceneName;
        this.current().emit(SceneEvent.Enter, previous, ...args);
        this.current().enter(previous, ...args);
        this.events.emit(SceneEvent.Enter, previous, sceneName, ...args);
    }
}