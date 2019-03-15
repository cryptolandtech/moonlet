const zipFolder = require('zip-folder');
const resolve = require('path').resolve;

const SOURCE_FOLDER = resolve(__dirname, '../build/extension');
const ZIP_FILE_NAME = resolve(__dirname, '../build/extension.zip');

zipFolder(SOURCE_FOLDER, ZIP_FILE_NAME, function(err) {
    if (err) {
        console.log('oh no! ', err);
    } else {
        console.log(`Successfully zipped the ${SOURCE_FOLDER} directory as ${ZIP_FILE_NAME}`);
    }
});
