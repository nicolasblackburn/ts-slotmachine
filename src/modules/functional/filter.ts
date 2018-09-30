import { curry } from "./curry";

export const filter = curry((f, xs) =>
    xs.filter(f));