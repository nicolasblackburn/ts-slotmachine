import { curry } from "./curry";

export const mult =
    curry((a, b) =>
        a.asOwnProperty("mult") ?
            a.add(b) :
            a * b);