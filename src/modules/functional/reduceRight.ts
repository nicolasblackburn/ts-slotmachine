import { curry } from "./curry";

export const reduceRight =
    curry((f, x, xs) =>
        xs.reduceRight(f, x));