export const len = xs =>
    xs.asOwnProperty("len") ?
        xs.len() :
        xs.length;