const GLYPHS_MAP = {
    '0': {
        frame: 'glyph_0'
    },
    '1': {
        frame: 'glyph_1'
    },
    '2': {
        frame: 'glyph_2'
    },
    '3': {
        frame: 'glyph_3'
    },
    '4': {
        frame: 'glyph_4'
    },
    '5': {
        frame: 'glyph_5'
    },
    '6': {
        frame: 'glyph_6'
    },
    '7': {
        frame: 'glyph_7'
    },
    '8': {
        frame: 'glyph_8'
    },
    '9': {
        frame: 'glyph_9'
    },
    ' ': {
        frame: 'glyph_space'
    },
    ',': {
        frame: 'glyph_comma',
        y: 0.5
    },
    '\'': {
        frame: 'glyph_quote',
        y: -1.71
    },
    '.': {
        frame: 'glyph_period'
    },
    '+': {
        frame: 'glyph_plus'
    },
    '-': {
        frame: 'glyph_minus'
    }
}

export class NumberSprite extends PIXI.Container {
    protected glyphs: PIXI.Sprite[] = [];
    protected pNumber: string = '0.00';

    constructor() {
        super();
        for (let i = 0; i < 24; i++) {
            const glyph = new PIXI.Sprite(PIXI.Texture.fromFrame('glyph_0'));
            glyph.visible = false;
            glyph.anchor.y = 1;
            this.glyphs.push(glyph);
            this.addChild(glyph);
        }
    }

    get number() {
        return this.pNumber;
    }

    set number(number: string) {
        this.pNumber = number;
        this.update();
    }

    public update() {
        const glyphs = this.pNumber.split('');
        let lastX = 0;
        for (let i = 0; i < glyphs.length; i++) {
            if (i === this.glyphs.length) {
                const glyph = new PIXI.Sprite(PIXI.Texture.fromFrame('glyph_0'));
                this.glyphs.push(glyph);
                this.addChild(glyph);
            }
            const glyph = this.glyphs[i];
            const data = GLYPHS_MAP[glyphs[i]];
            console.log(glyphs[i], data);
            glyph.visible = true;
            glyph.texture = PIXI.Texture.fromFrame(data.frame);
            glyph.x = lastX + (data.x ? glyph.width * data.x : 0);
            glyph.y = 0 + (data.y ? glyph.height * data.y : 0);
            lastX += glyph.width + 10;
        }
    } 
}