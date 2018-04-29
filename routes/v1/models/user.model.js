'use strict';

//const log = require('winston');

module.exports.save = (user) => {
    let User = require('../schemas/user.schema.js');
    let newUser = new User(user);
    return newUser.save();
};


module.exports.findByID = (id) => {
    let User = require('../schemas/user.schema.js');
    return User.findById(id);
};