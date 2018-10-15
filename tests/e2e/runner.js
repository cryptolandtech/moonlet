// const path = require('path');
// const slug = require('slug');
const browser = require('./browser');
const options = require('./options');
const httpServer = require('./httpserver');

before(done => {
    httpServer.startApp();
    browser.setOptions(options);
    browser.setUp(done);
});
after(() => {
    browser.close();
    httpServer.stopApp();
});
