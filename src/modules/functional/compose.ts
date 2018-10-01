import { curry } from "./curry";

export const compose =
    curry((g, f) =>
        g.hasOwnProperty("compose") ?
            g.compose(f) :
            x => g(f(x)));