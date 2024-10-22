/* istanbul ignore file */
'use strict';

global.__basedir = __dirname;

const express = require('express');
const app = express();
const log = require('winston');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.json()); // for parsing application/json

const mongoose = require('mongoose');
mongoose.connect(`mongodb://${process.env.MONGODB_HOST}/userservice`);

let db = mongoose.connection;
db.on('error', function(error) {
    log.error(error);
    process.exit(1);
});

db.once('open', function() {
    log.info('connected to mongo');
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        // Here you would look up the user in your DB and check the password
        // For now, we'll just pretend the user is authenticated
        if (username === 'user' && password === 'password') {
            return done(null, { id: 1, username: 'user' });
        } else {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
    }
));

app.use(passport.initialize());

app.get('/', (req, res) => res.send('I am alive'));
app.use('/api/v1/', passport.authenticate('local', { session: false }), require('./routes/v1/'));

module.exports = app.listen(3000, () => log.info('users api listening on port 3000!'));