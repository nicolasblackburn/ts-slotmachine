import { slice } from "./slice";

export const tail = xs =>
    xs.hasOwnProperty("tail") ?
        xs.tail() :
        slice(1, Number.POSITIVE_INFINITY, xs);