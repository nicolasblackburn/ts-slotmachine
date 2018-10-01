import { prop } from "./prop";

export const head = xs =>
    xs.hasOwnProperty("head") ?
        xs.head() :
        prop(0, xs);