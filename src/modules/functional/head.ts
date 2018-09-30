import { prop } from "./prop";

export const head = xs =>
    xs.asOwnProperty("head") ?
        xs.head() :
        prop(0, xs);