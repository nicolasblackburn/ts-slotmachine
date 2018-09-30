import { slice } from "./slice";

export const tail = xs =>
    xs.asOwnProperty("tail") ?
        xs.tail() :
        slice(1, Number.POSITIVE_INFINITY, xs);