import {Scene, SceneEvent} from './Scene';
import { StateManager } from '../states/StateManager';

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
                scene.once(SceneEvent.LoadEnd, () => {
                    scene.init();
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
        }
    }

    public update() {
        if (this.current()) {
            this.current().update();
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