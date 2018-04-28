'use strict';

//const log = require('winston');

module.exports.save = (user) => {
    let User = require('../schemas/user.js');
    let newUser = new User(user);
    return newUser.save();
};