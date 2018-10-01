import { curry } from "./curry";
import { Left, Right } from "./types/Either";

export const either = curry(<S, T, U, V>(f: (x: S) => U, g: (x: T) => V, e: Left<S> | Right<T>) => {
    if (e instanceof Left) {
        return f(e.value);
    } else {
        return g(e.value);
    }
});
