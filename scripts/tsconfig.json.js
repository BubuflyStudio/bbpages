/**
 * tsconfig
 */
'use strict';

const tsConfig = {

};

const fs = require('fs');
const path = require('path');
const targetFile = path.join(__dirname, '../tsconfig.json');
fs.writeFileSync(targetFile, JSON.stringify(tsConfig, null, 2), {
    encoding: 'utf8',
    flags: 'w',
    mode: 0o666
});