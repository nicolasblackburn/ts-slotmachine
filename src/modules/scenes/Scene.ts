import { SceneEvent } from "./SceneEvent";

export class Scene extends PIXI.Container {
    public active: boolean = false;
    protected resources: {name: string, url: string}[] = [];
    protected pInitialized: boolean = false;
    protected loaded: boolean = false;

    constructor() {
        super();
    }

    get initialized() {
        return this.pInitialized;
    }
    
    /**
     * Adds a resource to the
     * @param name
     * @param url 
     */
    public addResource(name: string, url: string) {
        if (this.loaded) {
            throw new Error('Cannot add resource once the scene is loaded.');
        }
        this.resources.push({name: name, url: url});
        return this;
    }

    public load() {
        if (this.loaded) {
            throw new Error('Cannot load once the scene is loaded.');
        }

        this.emit(SceneEvent.LoadStart);

        for (const {name, url} of this.resources) {
            PIXI.loader.add(name, url);
        }

        PIXI.loader.onProgress.add((progress) => {
            this.emit(SceneEvent.LoadProgress, progress);
        });
        
        PIXI.loader.load(() => {
            this.loaded = true;
            this.emit(SceneEvent.LoadEnd);
        });
    }

    public init() {}

    public resize() {} 

    public enter(previousScene: string, ...args: any[]) {}
    
    public exit(nextScene: string, ...args: any[]) {}

    public update() {} 
}