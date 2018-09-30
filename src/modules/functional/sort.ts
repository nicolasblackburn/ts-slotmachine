import { curry } from "./curry";

export const sort = curry((f, xs) =>
    xs.sort(f));