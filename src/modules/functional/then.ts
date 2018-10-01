import { curry } from "./curry";

export const then =
    curry((success, fail, promise) =>
        promise.then(success, fail));