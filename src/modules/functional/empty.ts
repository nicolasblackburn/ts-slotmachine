export const empty = xs =>
    xs.asOwnProperty("empty") ?
        xs.empty() :
        !xs;