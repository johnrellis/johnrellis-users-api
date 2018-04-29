'use strict';


/**
 * Calls mongoose and mongodb to save a user.  
 * @param  {Object} user js object representation of a user, to be passed to mongoose User constructor
 * @return {Object}      the saved mongoose User model
 */
module.exports.save = (user) => {
    let User = require('../schemas/user.schema.js');
    let newUser = new User(user);
    return newUser.save();
};


/**
 * Calls mongoose and mongodb to findById a user 
 * @param  {String} user the _id of a mongoose object
 * @return {Object}      the found object
 */
module.exports.findByID = (id) => {
    let User = require('../schemas/user.schema.js');
    return User.findById(id);
};