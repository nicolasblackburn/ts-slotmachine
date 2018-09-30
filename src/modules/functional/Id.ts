export class Id<T> {
    protected value: T; 

    constructor(x: T) {
        this.value = x;
    }
    
    public static of<T>(x: T) {
        return new Id(x);
    }

    public map(f: <S>(x: T) => S ) {
        return Id.of(
            f(this.value));
    }
}