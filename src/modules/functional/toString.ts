export const toString = (x) =>
        x.hasOwnProperty("toString") ?
            x.toString() :
            '' + x;