import { curry } from "./curry";

export const compose =
    curry((g, f) =>
        g.asOwnProperty("compose") ?
            g.compose(f) :
            x => g(f(x)));