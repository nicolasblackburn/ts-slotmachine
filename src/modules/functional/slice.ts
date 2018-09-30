import { curry } from "./curry";

export const slice = curry((from, to, xs) =>
    xs.slice(from, to));