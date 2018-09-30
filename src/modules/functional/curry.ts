export function curry(f) {
    const n = f.length;
    return function g(...xs) {
        return xs.length < n ?
            g.bind(null, ...xs) :
            f(...xs);
    };
}