import { curry } from "./curry";

export const prop = curry((name, x) => x[name]);