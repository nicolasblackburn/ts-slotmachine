export abstract class State {
    public enter(previous: string, ...args: any[]) {}
    public update() {}
    public exit(next: string, ...args: any[]) {}
}
