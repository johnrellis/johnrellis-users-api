'use strict';

const log = require('winston');

module.exports = async (req, res) => {
    let userModel = require('../../models/user.js');
    try {
        let user = await userModel.save(req.body);
        res.status(201).json(user);
    }catch(error){
        log.error(error);
        res.sendStatus(400);
    }
};