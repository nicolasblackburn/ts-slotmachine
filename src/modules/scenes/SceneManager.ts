import {Scene, SceneEvent} from './Scene';

export class SceneManager {
    protected currentSceneName: string;
    protected currentScene: Scene;
    protected scenes: Map<string, Scene> = new Map();
    protected application: PIXI.Application;

    constructor(application: PIXI.Application) {
        this.application = application;
    }

    public get(sceneName: string) {
        const scene = this.scenes.get(sceneName);
        if (!scene) {
            throw new Error('Scene `' + sceneName + '` not found');
        } else {
            return scene;
        }
    }

    public add(sceneName: string, scene: Scene) {
        scene.visible = false;
        scene.interactive = false;
        this.scenes.set(sceneName, scene);
        this.application.stage.addChild(scene);
        return scene;
    }

    public show(sceneName: string) {
        const scene = this.scenes.get(sceneName);
        if (!scene) {
            throw new Error('Scene `' + sceneName + '` not found');
        } else if (!scene.initialized) {  
            scene.once(SceneEvent.LoadEnd, () => {
                scene.init();
                scene.emit(SceneEvent.Init);
                this.setCurrentScene(sceneName, scene);
                scene.show();
                scene.emit(SceneEvent.Show);
            });
            scene.load();
        } else {
            this.setCurrentScene(sceneName, scene);
            scene.show();
            scene.emit(SceneEvent.Show);
        }
        return scene;
    }

    public getCurrentName() {
        return this.currentSceneName;
    }

    public getCurrent() {
        return this.currentScene;
    }

    public resize() {
        if (this.currentScene) {
            this.currentScene.resize();
            this.currentScene.emit(SceneEvent.Resize);
        }
    }

    public update() {
        if (this.currentScene) {
            this.currentScene.update();
            this.currentScene.emit(SceneEvent.Update);
        }
    }

    protected setCurrentScene(sceneName: string, scene: Scene) {
        this.application.stage.setChildIndex(scene, this.application.stage.children.length - 1);
        scene.visible = true;
        scene.interactive = true;
        scene.resize();

        if (this.currentScene) {
            this.currentScene.visible = false;
            this.currentScene.interactive = false;
        } 

        this.currentSceneName = sceneName;
        this.currentScene = scene;

        scene.emit(SceneEvent.Show);
    }
}