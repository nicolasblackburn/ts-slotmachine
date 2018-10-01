export const not = x =>
    x.hasOwnProperty("not") ?
        x.not() :
        !x;