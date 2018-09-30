import { curry } from "./curry";

export const reduce =
    curry((f, x, xs) =>
        xs.reduce(f, x));