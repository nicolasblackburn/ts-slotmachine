import { curry } from "./curry";

export const lte = curry((a, b) =>
    a.hasOwnProperty("lte") ?
        a.lte(b) :
        a < b);