import { curry } from "./curry";

export const replace =
    curry((pat, rep, s) =>
        s.replace(pat, rep));