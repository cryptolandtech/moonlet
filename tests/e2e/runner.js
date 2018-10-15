// const path = require('path');
// const slug = require('slug');
const browser = require('./browser');
const options = require('./options');
before((done) => {
	browser.setOptions(options);
	browser.setUp(done);
});
after(() => {
	browser.close();
});