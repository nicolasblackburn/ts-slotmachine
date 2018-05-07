import * as fs from 'fs';
import * as path from 'path';
import * as proc from 'child_process';

// The svg file to read the data from.
const source = process.argv[2];
const exportDir = path.dirname(source);

for (const id of [
    'glyph_0',
    'glyph_1',
    'glyph_2',
    'glyph_3',
    'glyph_4',
    'glyph_5',
    'glyph_6',
    'glyph_7',
    'glyph_8',
    'glyph_9',
    'glyph_comma',
    'glyph_period',
    'glyph_quote'
]) {
    proc.execSync('inkscape -z ' + source + ' -C -j -i ' + id + ' -e ' + path.resolve(exportDir, id + '.png'));
}