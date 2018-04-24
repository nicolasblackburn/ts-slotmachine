export interface StateInterface {
    onEnter(previous: string, ...args: any[]);
    onExit(next: string, ...args: any[]);
}

export abstract class State implements StateInterface {
    public onEnter(previous: string, ...args: any[]) {}
    public onExit(next: string, ...args: any[]) {}
}
