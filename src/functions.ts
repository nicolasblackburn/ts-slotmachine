

export function modulo(x: number, n: number) {
    if (x < 0) {
        return x % n + n;
    } else {
        return x % n;
    }
}

export function htor(h: number) {
    h = modulo(h, 360);
    if (h < 60) {
        return 255;
    } else if (h < 120) {
        return Math.floor(255 * (1 - modulo(h, 60) / 60));
    } else if (h < 240) {
        return 0;
    } else if (h < 300) {
        return Math.floor(255 * modulo(h, 60) / 60);
    } else {
        return 255;
    }
}

export function htog(h: number) {
    h = modulo(h, 360);
    if (h < 60) {
        return Math.floor(255 * h / 60);
    } else if (h < 180) {
        return 255;
    } else if (h < 240) {
        return Math.floor(255 * (1 - modulo(h, 60) / 60));
    } else {
        return 0;
    }
}

export function htob(h: number) {
    h = modulo(h, 360);
    if (h < 120) {
        return 0;
    } else if (h < 180) {
        return Math.floor(255 * modulo(h, 60) / 60);
    } else if (h < 300) {
        return 255;
    } else {
        return Math.floor(255 * (1 - modulo(h, 60) / 60));
    }
}

export function htorgb(h: number) {
    return (htor(h) << 16) + (htog(h) << 8) + htob(h);
}

export function promiseFold(promise: Promise<any>, ...rest: Promise<any>[]) {
    if (rest.length === 0) {
        return promise;
    } else {
        return promise.then(() => {
            return promiseFold.apply(this, rest);
        });
    }
}