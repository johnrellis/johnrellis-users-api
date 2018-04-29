'use strict';

/*
 * A controller to act as a bridge between the http API and the persistence layer for the user resource.
 * Should not contain any specific implementation of persistence to allow ease of testing and introduce
 * a degree of decoupling
 */

const log = require('winston');
const transformIdOutgoing = require('../transformIdOutgoing');


/**
 * async function that saves a user and calls the result on the res object
 * 
 * @param  {Object} req the request object, typically an express Request
 * @param  {Object} res the response object, typically an express Response
 */
module.exports.save = async (req, res) => {
    let userModel = require('../models/user.model.js');
    try {
        let user = await userModel.save(req.body);
        let transformed = transformIdOutgoing(user);
        res.status(201).json(transformed);    
    }catch(error){
        log.error(error);
        res.status(400).json({error:error.message});
    }
};


/**
 * async function that retrives a user user for an id that is expected in req.params calls the result on the res object
 *
 * Will return 404 if user cannot be found
 * 
 * @param  {Object} req the request object, should contain params.id typically an express Request
 * @param  {Object} res the response object, typically an express Response
 */
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
        res.status(400).json({error:error.message});
    }
};