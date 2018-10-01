import { curry } from "./curry";

export const eq = curry((a, b) =>
    a.hasOwnProperty("eq") ?
        a.eq(b) :
        a === b);