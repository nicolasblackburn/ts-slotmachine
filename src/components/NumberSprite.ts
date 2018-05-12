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
        frame: 'glyph_comma'
    },
    '\'': {
        frame: 'glyph_quote'
    },
    '.': {
        frame: 'glyph_period'
    },
    '+': {
        frame: 'glyph_plus'
    },
    '-': {
        frame: 'glyph_minus'
    },
    'x': {
        frame: 'glyph_times'
    }
}

export class NumberSprite extends PIXI.Container {
    protected glyphs: PIXI.Sprite[] = [];
    protected pValue: string = '0.00';
    protected count: number = 0;

    constructor() {
        super();
        for (let i = 0; i < 24; i++) {
            const glyph = new PIXI.Sprite(PIXI.Texture.fromFrame('glyph_0'));
            glyph.visible = false;
            glyph.anchor.y = 1;
            this.glyphs.push(glyph);
            this.addChild(glyph);
        }
        this.value = '0.00';
    }

    get value() {
        return this.pValue;
    }

    set value(value: string) {
        this.pValue = value;
        this.update();
    }

    public update() {
        const glyphs = this.pValue.split('');
        let lastX = 0;
        let i = 0;
        let width = 0;
        for (; i < glyphs.length; i++) {
            if (i === this.glyphs.length) {
                const glyph = new PIXI.Sprite(PIXI.Texture.fromFrame('glyph_0'));
                this.glyphs.push(glyph);
                this.addChild(glyph);
            }
            const glyph = this.glyphs[i];
            const data = GLYPHS_MAP[glyphs[i]];
            glyph.visible = true;
            glyph.texture = PIXI.Texture.fromFrame(data.frame);
            glyph.x = lastX + (data.x ? glyph.width * data.x : 0);
            glyph.y = 0 + (data.y ? glyph.height * data.y : 0);
            lastX += glyph.width + 10;
            width += glyph.width + 10;
        }
        const lastCount = this.count;
        this.count = i;
        for (; i < lastCount; i++) {
            this.glyphs[i].visible = false;
        }
        this.pivot.x = width / 2;
        this.pivot.y = -this.height / 2;
    } 
}