import { StateInterface } from "../states/State";

export enum SceneEvent {
    Enter = 'SceneEvent.Enter',
    Exit = 'SceneEvent.Exit',
    LoadStart = 'SceneEvent.LoadStart',
    LoadEnd = 'SceneEvent.LoadEnd',
    Init = 'SceneEvent.Init',
    Resize = 'SceneEvent.Resize',
    Update = 'SceneEvent.Update'
}

export class Scene extends PIXI.Container implements StateInterface {
    protected resources: {name: string, url: string}[] = [];
    protected pInitialized: boolean = false;
    protected pLoaded: boolean = false;

    get initialized() {
        return this.pInitialized;
    }

    get loaded() {
        return this.pLoaded;
    }
    
    constructor() {
        super();
    }

    public addResource(name: string, url: string) {
        if (this.loaded) {
            throw new Error('Cannot register resources once the scene resources are already loaded.');
        }
        this.resources.push({name: name, url: url});
        return this;
    }

    public init() { 
    }

    public load() {
        if (this.loaded) {
            throw new Error('Cannot load an already loaded scene.');
        }

        this.emit(SceneEvent.LoadStart);

        for (const {name, url} of this.resources) {
            PIXI.loader.add(name, url);
        }
        
        PIXI.loader.load((resources: any) => {
            this.pLoaded = true;
            this.emit(SceneEvent.LoadEnd);
        });
    }

    public resize() {} 

    public enter() {}
    
    public exit() {}

    public update() {} 
}