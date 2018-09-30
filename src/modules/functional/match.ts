import { curry } from "./curry";

export const match = curry((pat, s) =>
    s.match(pat));