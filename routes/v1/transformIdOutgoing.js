'use strict';

const _ = require('lodash');

/**
* If outgoing object contains _id, it is replaced with a property called id with the same value.  _id is removed
* @param  {Object} objectToBeTransformed object to be transformed
* @return {Object}                a copy of the object with _id converted to id
*/
module.exports = (objectToBeTransformed) => {
    let clonedOutgoing = {};
    if(objectToBeTransformed){
        clonedOutgoing = _.cloneDeep(objectToBeTransformed);
        clonedOutgoing.id = objectToBeTransformed._id;
        delete clonedOutgoing._id;
    } 
    return clonedOutgoing;
};