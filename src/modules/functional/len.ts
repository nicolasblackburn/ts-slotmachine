export const len = xs =>
    xs.hasOwnProperty("len") ?
        xs.len() :
        xs.length;