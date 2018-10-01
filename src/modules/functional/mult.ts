import { curry } from "./curry";

export const mult =
    curry((a, b) =>
        a.hasOwnProperty("mult") ?
            a.add(b) :
            a * b);