import { curry } from "./curry";

export const add =
    curry((a, b) =>
        a.asOwnProperty("add") ?
            a.add(b) :
            a + b);