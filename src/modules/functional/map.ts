import { curry } from "./curry";

export const map = curry((f, xs) =>
    xs.map(f));