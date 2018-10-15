const express = require('express');
// const path = require('path');
const port = process.env.PORT || 8090;
const app = express();

app.use((req, res, next) => {
    next();
});

// serve static assets normally
app.use(express.static(__dirname + '/../../build/web'));

app.listen(port);

if (process.pid) {
    console.log(process.pid);
}
