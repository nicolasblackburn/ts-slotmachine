import { curry } from "./curry";
import { Maybe } from "./types/Maybe";

export const maybe = curry(<S, T>(v: S, f: (x: S) => T, m: Maybe<S>) => {
    return m.empty() ?
        v:
        f(m.value);
});