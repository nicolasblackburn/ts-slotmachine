import {Scene} from './Scene';
import { SceneEvent } from './SceneEvent';

export class SceneManager {
    public events: PIXI.utils.EventEmitter;
    protected scenes: Map<string, Scene> = new Map();
    protected pCurrent: string;
    protected stage: PIXI.Container;

    constructor(stage: PIXI.Container) {
        this.events = new PIXI.utils.EventEmitter();
        this.stage = stage;
    }

    public add(sceneName: string, scene: Scene) {
        scene.visible = false;
        scene.interactive = false;
        this.scenes.set(sceneName, scene);
        this.stage.addChild(scene);
        return scene;
    }

    public get(key: string) {
        return this.scenes.get(key);
    }

    public currentKey() {
        return this.pCurrent;
    }

    public current() {
        return this.scenes.get(this.pCurrent);
    }

    public setCurrent(sceneName: string, ...args: any[]) {
        const scene = this.scenes.get(sceneName);
        if (!this.scenes.has(sceneName)) {
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

    protected swapCurrentSceneAndEnter(sceneName: string, scene: Scene, ...args: any[]) {
        this.stage.setChildIndex(scene, this.stage.children.length - 1);
        scene.visible = true;
        scene.interactive = true;
        scene.resize();

        let previous = this.currentKey();
        if (this.current()) {
            this.current().active = false;
            this.current().visible = false;
            this.current().interactive = false;
            this.current().emit(SceneEvent.Exit, sceneName, ...args);
            this.current().exit(sceneName, ...args);
            this.events.emit(SceneEvent.Exit, previous, sceneName, ...args);
        } 

        this.pCurrent = sceneName;
        this.current().active = true;
        this.current().emit(SceneEvent.Enter, previous, ...args);
        this.current().enter(previous, ...args);
        this.events.emit(SceneEvent.Enter, previous, sceneName, ...args);
    }
}