import { DisplayObject } from 'pixi.js';
import { modulo } from '../functions'

export class Reel {
    public rowHeight: number = 0;
    public velocity: number = 0;
    protected pPosition: number = 0;
    protected symbols: PIXI.DisplayObject[] = [];
    protected visibleSymbols: PIXI.DisplayObject[] = [];
    protected pX: number = 0; 
    protected pY: number = 0; 
    protected rowCount: number = 0;

    constructor(rowCount: number, symbols: PIXI.DisplayObject[] = []) {
        this.symbols = symbols;
        this.rowCount = rowCount;
        this.position = 0;
    }

    get position() {
        return this.pPosition;
    }

    set position(position: number) {
        if (this.getSymbolCount() === 0) {
            this.pPosition = 0;

        } else {
            this.pPosition = modulo(position, this.getSymbolCount());
            this.update();
        }

    }

    get x() {
        return this.pX;
    }

    set x(x: number) {
        this.pX = x;
        for (const symbol of this.visibleSymbols) {
            symbol.x = x;
        }
    }

    get y() {
        return this.pY;
    }

    set y(y: number) {
        this.pY = y;
        const offset = Math.floor(modulo(this.position, this.getSymbolCount()));
        for (let i = 0; i < this.rowCount + 1; i++) {
            const symbol = this.symbols[modulo(offset + i, this.getSymbolCount())];
            symbol.y = this.pY + (i - 1 - modulo(this.position, 1)) * this.rowHeight;
        }
    }

    public update() {
        for (const symbol of this.visibleSymbols) {
            symbol.visible = false;
        }
        this.visibleSymbols = [];
        this.pPosition += this.velocity;
        const offset = Math.ceil(modulo(this.pPosition, this.getSymbolCount())) - 1;
        for (let i = 0; i < this.rowCount + 1; i++) {
            const symbolIndex = modulo(offset + i, this.getSymbolCount());
            const symbol = this.symbols[symbolIndex];
            symbol.visible = true;
            symbol.x = this.pX;
            const epsilon = this.pPosition - Math.floor(this.pPosition);
            if (epsilon === 0) {
                symbol.y = this.pY + (i - 1) * this.rowHeight;
            } else {
                symbol.y = this.pY + (i - epsilon) * this.rowHeight;
            }
            this.visibleSymbols.push(symbol);
        }
    }

    public getSymbolCount() {
        return this.symbols.length;
    }

    public addSymbol(symbol: DisplayObject) {
        this.symbols.push(symbol);
    }

    public insertSymbolAt(symbol: DisplayObject, index: number) {
        this.symbols.splice(index, 0, symbol);
    }

    public removeSymbolAt(index: number) {
        this.symbols.splice(index, 1);
    }

    public removeSymbol(symbolA: DisplayObject) {
        const index = this.symbols.findIndex(symbolB => symbolB === symbolA);
        if (index >= 0) {
            this.symbols.splice(index, 1);
        }
    }

    public removeAllSymbols() {
        this.symbols = [];
    }
}