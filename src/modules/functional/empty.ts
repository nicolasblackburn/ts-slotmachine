export const empty = xs =>
    xs.hasOwnProperty("empty") ?
        xs.empty() :
        !xs;