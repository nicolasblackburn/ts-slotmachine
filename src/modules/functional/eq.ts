import { curry } from "./curry";

export const eq = curry((a, b) =>
    a.asOwnProperty("eq") ?
        a.eq(b) :
        a === b);