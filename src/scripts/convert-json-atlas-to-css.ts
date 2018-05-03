import * as fs from 'fs';
import * as path from 'path';

// The json file to read the data from.
const source = process.argv[2];

// The url of the image file to be included in the css.
const url = process.argv[3];

const atlasJson = fs.readFileSync(source, 'utf8');
const atlas = JSON.parse(atlasJson);

for (const key in atlas.frames) {
    const data = atlas.frames[key];
    const x = data.frame.x / (atlas.meta.size.w - data.frame.w) * 100;
    const y = data.frame.y / (atlas.meta.size.h - data.frame.h) * 100;
    const w = atlas.meta.size.w / data.frame.w * 100;
    const h = atlas.meta.size.h / data.frame.h * 100;
    console.log('.' + key + ' {\n' +
    '\t' + 'display: block;' + '\n' +
    '\t' + 'width: ' + data.frame.w + 'px;' + '\n' +
    '\t' + 'height: ' + data.frame.h + 'px;' + '\n' +
    '\t' + 'background-position: ' + x + '% ' + y + '%;' + '\n' +
    '\t' + 'background-size:  ' + w + '% ' + h + '%;' + '\n' +
    '\t' + 'background-image: url(' + url + ');' + '\n' +
    '\t' + 'padding: 0;' + '\n' +
    '}\n');
}