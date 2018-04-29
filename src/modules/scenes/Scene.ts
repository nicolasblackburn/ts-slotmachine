import { StateInterface } from "../states/State";
import { PlayResponse } from "../client/PlayResponse";
import { ApplicationInterface } from "../../ApplicationInterface";
import { SceneEvent } from "./SceneEvent";
import { ApplicationEventListener } from "../../ApplicationEventListener";
import { Win } from "../client/Win";

export class Scene extends PIXI.Container implements StateInterface, ApplicationEventListener {
    protected application: ApplicationInterface;
    protected resources: {name: string, url: string}[] = [];
    protected pInitialized: boolean = false;
    protected loaded: boolean = false;

    constructor(application: ApplicationInterface) {
        super();
        this.application = application;
    }

    get initialized() {
        return this.pInitialized;
    }
    
    public addResource(name: string, url: string) {
        if (this.loaded) {
            throw new Error('Cannot register resources once the scene resources are already loaded.');
        }
        this.resources.push({name: name, url: url});
        return this;
    }

    public load() {
        if (this.loaded) {
            throw new Error('Cannot load an already loaded scene.');
        }

        this.emit(SceneEvent.LoadStart);

        for (const {name, url} of this.resources) {
            PIXI.loader.add(name, url);
        }

        PIXI.loader.onProgress.add((progress) => {
            this.emit(SceneEvent.LoadProgress, progress);
        });
        
        PIXI.loader.load((resources: any) => {
            this.loaded = true;
            this.emit(SceneEvent.LoadEnd);
        });
    }

    public init() {}

    public resize() {} 

    public enter(previousScene: string, ...args: any[]) {}
    
    public exit(nextScene: string, ...args: any[]) {}

    public update() {} 

    public roundStart() {}

    public roundEnd() {}

    public spinStart() {}

    public spinEndReady() {}

    public spinEnd(response: PlayResponse) {}

    public slam() {}

    public resultsStart(response: PlayResponse) {}

    public resultsEnd() {}

    public skipResults() {}

    public playRequestSuccess(response: PlayResponse) {}

    public playRequestError(error: Error) {}

    public winsStart(response: PlayResponse) {}

    public winsEnd() {}

    public totalWinStart(response: PlayResponse) {}

    public totalWinEnd() {}

    public winStart(win: Win) {}

    public winEnd() {}

    public featureStart(feature: string, response: PlayResponse) {}

    public featureEnd() {}
}