var CryptoJS = require('crypto-js');

var data = [{ id: 1 }, { id: 2 }];

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123');

// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 1234');
var x = bytes.toString(CryptoJS.enc.Utf8);

if (bytes) {
    console.log(bytes.toString(CryptoJS.enc.Utf8));
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    console.log(decryptedData);
}
