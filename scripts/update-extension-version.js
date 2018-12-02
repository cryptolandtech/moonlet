const fs = require("fs");
const resolve = require('path').resolve;
const manifest = require("../src/extension/manifest.json");
const BUILD = process.env.TRAVIS_BUILD_NUMBER;
const VERSION_FILE_PATH = resolve(__dirname, "../src/extension/version.ts");

const VERSION_PATTERN = `export const VERSION = "%%VERSION%%";`;

let VER = manifest.version;
if (BUILD) {
    VER += "." + BUILD;
}

fs.writeFileSync(VERSION_FILE_PATH, VERSION_PATTERN.replace("%%VERSION%%", VER));
