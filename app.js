'use strict';

const express = require('express');
const app = express();
const log = require('winston');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

let db = mongoose.connection;
db.on('error', function(error) {
    log.error(error);
});
db.once('open', function() {
    log.info('connected to mongo');
});

app.get('/', (req, res) => res.send('I am alive'));


module.exports = app.listen(3000, () => log.info('users api listening on port 3000!'));