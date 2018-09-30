export class Maybe<T> {
    protected value: T; 

    constructor(x: T) {
        this.value = x;
    }
    
    public static of<T>(x: T) {
        return new Maybe(x);
    }

    public empty() {
        return this.value === null || this.value === undefined;
    }

    public map(f: <S>(x: T) => S ) {
        return this.empty() ? 
            this :
            Maybe.of(f(this.value));
    }
}