export class Either<T> {
    public value: T;

    public static of<T>(x: T) {
        return new Right(x);
    }

    constructor(x) {
        this.value = x;
    }
}

export class Left<T> extends Either<T> {
    public map<S>(f: (x: T) =>  S) {
        return this;
    }
}

export class Right<T> extends Either<T> {
    public map(f) {
        return Either.of(f(this.value));
    }
}

export const left = x => new Left(x);