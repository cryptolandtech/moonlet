const fs = require('fs');
const resolve = require('path').resolve;
const manifest = require('../src/platforms/extension/manifest.json');
const packageJson = require('../package.json');

manifest.version = packageJson.version;

fs.writeFileSync(
    resolve(__dirname, '../src/platforms/extension/manifest.json'),
    JSON.stringify(manifest, null, 4)
);
