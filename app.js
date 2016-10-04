'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const uaparser = require('ua-parser'); // module for user-agent parser
const accepts = require('accepts'); // module for language header

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.get('/', (req, res) => {
    let local = req.get('host');
    res.render('index', {
        host: local
    });
});

app.get('/*', (req, res) => { // wildcard catch-all
    let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    let os = req.headers['user-agent']; // requests user-agent headers
    os = uaparser.parseOS(os).toString(); // sets os string to var os
    let lang = accepts(req).languages()[0]; // sets language to var lang
    res.json({
        ipAddress: ip,
        language: lang,
        software: os
    });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
    console.log('Server listening on port ' + port);
});
