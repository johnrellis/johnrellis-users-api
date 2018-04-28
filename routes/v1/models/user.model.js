'use strict';

//const log = require('winston');

module.exports.save = (user) => {
    let User = require('../schemas/user.schema.js');
    let newUser = new User(user);
    return newUser.save();
};