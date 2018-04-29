'use strict';

const log = require('winston');
const transformIdOutgoing = require('../transformIdOutgoing');


module.exports.save = async (req, res) => {
    let userModel = require('../models/user.model.js');
    try {
        let user = await userModel.save(req.body);
        let transformed = transformIdOutgoing(user);
        res.status(201).json(transformed);    
    }catch(error){
        log.error(error);
        res.sendStatus(400);
    }
};


module.exports.get = async (req, res) => {
//todo : should validate that id actually exists
    log.info(`Attempting to retrieve user for ${req.params.id}`);
    let userModel = require('../models/user.model.js');
    try {
        let user = await userModel.findByID(req.params.id);
        if(user){
            let transformed = transformIdOutgoing(user);
            res.status(200).json(transformed);
        } else {
            res.sendStatus(404);
        }
    }catch(error){
        log.error(error);
        res.sendStatus(400);
    }
};