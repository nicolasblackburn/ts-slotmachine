export enum SceneEvent {
    LoadStart = 'SceneEvent.LoadStart',
    LoadEnd = 'SceneEvent.LoadEnd',
    Init = 'SceneEvent.Init',
    Resize = 'SceneEvent.Resize',
    Show = 'SceneEvent.Show',
    Update = 'SceneEvent.Update'
}

export class Scene extends PIXI.Container {
    protected application: PIXI.Application;
    protected resources: {name: string, url: string}[] = [];
    protected propInitialized: boolean = false;
    protected propLoaded: boolean = false;

    get initialized() {
        return this.propInitialized;
    }

    get loaded() {
        return this.propLoaded;
    }
    
    constructor(application: PIXI.Application) {
        super();
        this.application = application;
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
            this.propLoaded = true;
            this.emit(SceneEvent.LoadEnd);
        });
    }

    public resize() {
    } 

    public show() {
    } 

    public update() {
    } 
}