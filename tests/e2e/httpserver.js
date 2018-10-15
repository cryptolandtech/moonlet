const express = require('express');
// const path = require('path');
const port = process.env.PORT || 8090;
const app = express();
let server;

app.use((req, res, next) => {
    next();
});

// serve static assets normally
app.use(express.static(__dirname + '/../../build/web'));

module.exports.startApp = () => {
    server = app.listen(port, () => {
        console.log("App started on port " + port)
    });
}

module.exports.stopApp = () => {
    if (server) {
        server.close(() => {
            console.log("App stopped");
        })
    }
}