function modulo(x: number, n: number) {
    if (x < 0) {
        return x % n + n;
    } else {
        return x % n;
    }
}

function htor(h: number) {
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

function htog(h: number) {
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

function htob(h: number) {
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

function htorgb(h: number) {
    return (htor(h) << 16) + (htog(h) << 8) + htob(h);
}

export class Reel extends PIXI.Container {
    protected propPosition: number = 0;
    protected symbols: PIXI.DisplayObject[] = [];
    protected visibleSymbols: PIXI.DisplayObject[] = [];
    protected propWidth: number = 0; 
    protected propHeight: number = 0; 
    protected propX: number = 0; 
    protected propY: number = 0; 
    protected rowCount: number = 0;
    protected rowHeight: number = 0;

    constructor() {
        super();

        const defs = [
            'sym_10', 
            'sym_j', 
            'sym_q', 
            'sym_k', 
            'sym_a', 
            'sym_apple',
            'sym_banana',
            'sym_grape', 
            'sym_lemon',
            'sym_cherry'
        ];
        
        const rowCount = 3;
        const symbols = [];
        for (let i = 0; i < 60; i++) {
            const textureIndex = i % defs.length;
            const texture = PIXI.Texture.fromFrame(defs[textureIndex]);
            const symbol = new PIXI.Sprite(texture);
            symbol.visible = false;
            symbol.tint = htorgb(330 - 360 * textureIndex / defs.length);
            symbols.push(symbol);
            this.addChild(symbol);
            if (!i) {
                this.rowHeight = texture.height;
            }
        }

        this.symbols = symbols;
        this.rowCount = rowCount;
        this.reelPosition = 0;
    }

    get reelPosition() {
        return this.propPosition;
    }

    set reelPosition(position: number) {
        this.propPosition = modulo(position, this.getSymbolCount());
        for (const symbol of this.visibleSymbols) {
            symbol.visible = false;
        }
        this.visibleSymbols = [];
        const offset = Math.floor(modulo(position, this.getSymbolCount()));
        for (let i = 0; i < this.rowCount + 1; i++) {
            const symbol = this.symbols[modulo(offset + i, this.getSymbolCount())];
            symbol.visible = true;
            symbol.y = (i - 1 - modulo(position, 1)) * this.rowHeight;
            this.visibleSymbols.push(symbol);
        }
    }

    public getSymbolCount() {
        return this.symbols.length;
    }
}