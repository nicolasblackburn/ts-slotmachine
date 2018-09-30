import { curry } from "./curry";

export const lte = curry((a, b) =>
    a.asOwnProperty("lte") ?
        a.lte(b) :
        a < b);