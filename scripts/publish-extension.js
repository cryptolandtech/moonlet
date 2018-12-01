const zipFolder = require('zip-folder');
const resolve = require('path').resolve;
const fs = require('fs');

const SOURCE_FOLDER = resolve(__dirname, '../build/extension');
const ZIP_FILE_NAME = resolve(__dirname, '../build/extension.zip');

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EXTENSION_ID = process.env.EXTENSION_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;

const webStore = require('chrome-webstore-upload')({
    extensionId: EXTENSION_ID,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN
});

const manifest = require(resolve(__dirname, '../build/extension/manifest.json'));
if (process.env.TRAVIS_BUILD_NUMBER) {
    const ver = manifest.version.split('.');
    manifest.version = `${ver[0]}.${ver[1]}.${process.env.TRAVIS_BUILD_NUMBER}`;
    fs.writeFileSync(
        resolve(__dirname, '../build/extension/manifest.json'),
        JSON.stringify(manifest)
    );
}

zipFolder(SOURCE_FOLDER, ZIP_FILE_NAME, function(err) {
    if (err) {
        console.log('oh no! ', err);
    } else {
        console.log(`Successfully zipped the ${SOURCE_FOLDER} directory as ${ZIP_FILE_NAME}`);
        // will be invoking upload process
        console.log(`Uploading the new version (${manifest.version})...`);
        upload(ZIP_FILE_NAME);
    }
});

function upload(zipName) {
    const extensionSource = fs.createReadStream(zipName);
    webStore
        .uploadExisting(extensionSource)
        .then(res => {
            if (res.uploadState !== 'SUCCESS') {
                console.log(`Error while uploading ZIP:`, res.itemError);
                return process.exit(1);
            }

            console.log('Successfully uploaded the ZIP');
            console.log('Publishing the new version');
            publish();
        })
        .catch(error => {
            console.log(`Error while uploading ZIP: ${error}`);
            process.exit(1);
        });
}

function publish() {
    // publish the uploaded zip
    webStore
        .publish('default')
        .then(res => {
            console.log('Successfully published the newer version');
        })
        .catch(error => {
            console.log(`Error while publishing uploaded extension: ${error}`);
            process.exit(1);
        });
}
