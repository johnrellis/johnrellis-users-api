'use strict';

const log = require('winston');

module.exports = (user) => {
    let User = require('../../schemas/user.js');
    let newUser = new User(user);
    newUser.save(function (err, newBorn) {
        if (err) return log.error(err);
        log.info('newUser saved',newBorn);
    }); 
};