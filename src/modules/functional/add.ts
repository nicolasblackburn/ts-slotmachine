import { curry } from "./curry";

export const add =
    curry((a, b) =>
        a.hasOwnProperty("add") ?
            a.add(b) :
            a + b);