'use strict';

const log = require('winston');

module.exports.save = async (req, res) => {
    let userModel = require('../models/user.model.js');
    try {
        let user = await userModel.save(req.body);
        res.status(201).json(user);
    }catch(error){
        log.error(error);
        res.sendStatus(400);
    }
};