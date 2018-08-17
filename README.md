# Moonlet Wallet Suite

[![Build Status](https://travis-ci.org/cryptolandtech/moonlet.svg?branch=master)](https://travis-ci.org/cryptolandtech/moonlet)

## Project setup
Install dependencies
``` bash
npm install
```

## Web app
``` bash
# serve with hot reload at localhost:8080
npm run dev:web

# build for production
npm run build:web
```

## Extension
``` bash
# serve with hot reload
npm run dev:ext

# build for production
npm run build:ext
```

### Test extension in Chrome
The extension build will be found in `build` folder.
To install extension, open Chrome, go to _Extensions_, activate _Developer mode_, select _Load unpacked_, choose `build` folder from disk. 
Changes in manifest file need an extension reload.

For detailed explanation on how things work, checkout the [CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).
