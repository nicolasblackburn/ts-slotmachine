export const not = x =>
    x.asOwnProperty("not") ?
        x.not() :
        !x;