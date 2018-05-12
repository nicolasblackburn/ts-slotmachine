import { modulo } from '../../functions'
import { ReelSymbol } from './ReelSymbol';
import * as gsap from 'gsap';
import { ReelEvent } from './ReelEvent';

export class Reel {
    public events: PIXI.utils.EventEmitter;
    public rowHeight: number = 0;
    public velocity: number = 0;
    public substitutions: {[position: number]: number} = {};
    protected pPosition: number = 0;
    protected symbols: ReelSymbol[] = [];
    protected substitutionSymbols: ReelSymbol[] = [];
    protected visibleSymbols: PIXI.DisplayObject[] = [];
    protected pX: number = 0; 
    protected pY: number = 0; 
    protected rowCount: number = 0;
    protected currentTween: gsap.Animation;

    constructor(rowCount: number, symbols: ReelSymbol[] = [], substitutionSymbols: ReelSymbol[] = []) {
        this.events = new PIXI.utils.EventEmitter();
        this.symbols = symbols;
        this.substitutionSymbols = substitutionSymbols;
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
        this.pPosition = modulo(this.pPosition + this.velocity, this.getSymbolCount());
        const offset = Math.ceil(modulo(this.pPosition, this.getSymbolCount())) - 1;
        for (let i = 0; i < this.rowCount + 1; i++) {
            const symbolIndex = modulo(offset + i, this.getSymbolCount());
            const symbol = this.getSymbolAt(symbolIndex);
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

    public spinStart(maxVelocity: number) {
        if (this.currentTween) {
            this.currentTween.kill();
        }
        const timeline = new gsap.TimelineLite();
        this.currentTween = timeline;
        timeline
            .to(this, 0.12, {
                ease: gsap.Quad.easeInOut,
                velocity: 0.2
            })
            .to(this, 0.2, {
                ease: gsap.Quad.easeIn,
                velocity: -maxVelocity
            });

        return timeline;
    }

    public spinEnd(position: number, maxVelocity: number) {
        if (this.currentTween) {
            this.currentTween.kill();
        }
        const timeline = new gsap.TimelineLite()
        this.currentTween = timeline;
        const currentIntegerPosition = Math.floor(this.position);
        const rowCount = this.rowCount;
        const symbolCount = this.getSymbolCount();
        const untilPosition = currentIntegerPosition - rowCount;
        const finalPosition = modulo(untilPosition, symbolCount);

        for (let i = 0; i < rowCount; i++) {
            this.substitutions[modulo(currentIntegerPosition - rowCount + i, symbolCount)] = modulo(position + i, symbolCount);
        }

        let currentPosition = this.position;
        const tween = gsap.TweenLite.to({}, 1, {})
            .eventCallback('onComplete', () => tween.restart())
            .eventCallback('onUpdate', () => {
                if (currentPosition <= untilPosition) {
                    tween.kill();
                    timeline
                        .set(this, {
                            position: finalPosition,
                            velocity: 0
                        })
                        .to(this, 0.07, {
                            ease: gsap.Quad.easeOut,
                            position: finalPosition - 0.4
                        })
                        .to(this, 0.07, {
                            ease: gsap.Quad.easeIn,
                            position: modulo(finalPosition - 0.4, symbolCount) + 0.4
                        })
                        .set(this, {
                            substitutions: {}, 
                            position: position
                        })
                        .call(() => this.events.emit(ReelEvent.SpinEndComplete));
                } else {
                    currentPosition -= maxVelocity;
                }
            });
        timeline.add(tween);
        return timeline;
    }

    public land() {
        const offset = Math.ceil(modulo(this.pPosition, this.getSymbolCount())) - 1;
        for (let i = 0; i < this.rowCount + 1; i++) {
            const symbolIndex = modulo(offset + i, this.getSymbolCount());
            const symbol = this.getSymbolAt(symbolIndex);
            symbol.land();
        }
    }

    public getSymbolAt(position) {
        position = modulo(position, this.getSymbolCount());
        const substitution = this.substitutions[position];
        if (typeof substitution !== 'undefined') {
            return this.substitutionSymbols[substitution];
        } else {
            return this.symbols[position];
        }
    }

    public getSymbolCount() {
        return this.symbols.length;
    }

    public addSymbol(symbol: ReelSymbol, substitution: ReelSymbol) {
        this.symbols.push(symbol);
        this.substitutionSymbols.push(substitution);
    }

    public insertSymbolAt(symbol: ReelSymbol, index: number, substitution: ReelSymbol) {
        this.symbols.splice(index, 0, symbol);
        this.substitutionSymbols.splice(index, 0, substitution);
    }

    public removeSymbolAt(index: number) {
        this.symbols.splice(index, 1);
        this.substitutionSymbols.splice(index, 1);
    }

    public removeSymbol(symbolA: ReelSymbol) {
        const index = this.symbols.findIndex(symbolB => symbolB === symbolA);
        if (index >= 0) {
            this.symbols.splice(index, 1);
            this.substitutionSymbols.splice(index, 1);
        }
    }

    public removeAllSymbols() {
        this.symbols = [];
        this.substitutionSymbols = [];
    }
}