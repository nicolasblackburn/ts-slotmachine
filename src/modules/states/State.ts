export interface StateInterface {
    enter(previous: string, ...args: any[]);
    exit(next: string, ...args: any[]);
}

export abstract class State implements StateInterface {
    public enter(previous: string, ...args: any[]) {}
    public exit(next: string, ...args: any[]) {}
}
