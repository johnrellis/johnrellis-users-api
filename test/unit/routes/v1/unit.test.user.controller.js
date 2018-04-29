'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
//import { mockReq, mockRes } from 'sinon-express-mock'
const mockReq = require('sinon-express-mock').mockReq;
const mockRes = require('sinon-express-mock').mockRes;
const mockery = require('mockery');
const version = require('./version');

chai.use(sinonChai);


describe('user controller', function() {
    let sandbox = null;
    let mockUser = {id:'12345f', email:'john@home.com'};

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        mockery.enable();
    });

    afterEach(function() {
        sandbox.restore();
        mockery.deregisterAll();
        mockery.disable();
    });

    let userCreateController = require(`${process.cwd()}/routes/${version}/controllers/user.controller`);

    let defaultUser = {
        email: 'john@home.com'
    };

    it('should be able to create a user', function() {
        let saveUserStub = sinon.sandbox.stub().resolves(mockUser);

        mockery.registerMock('../models/user.model.js', {save: saveUserStub});
        const request = {
            body : defaultUser
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.save(req,res).then(function() {
            expect(res.status).to.be.calledWith(201);
            expect(res.json).to.be.calledWith(mockUser);
        });
    });

    it('should not be able to create a user', function() {
        let saveUserStub = sinon.sandbox.stub().rejects('Failed to save');

        mockery.registerMock('../models/user.model.js', {save: saveUserStub});
        const request = {
            body : defaultUser
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.save(req,res).then(function() {
            expect(res.sendStatus).to.be.calledWith(400);
        });
    });

    it('should not be able find user by id', function() {
        let saveUserStub = sinon.sandbox.stub().resolves(mockUser);

        mockery.registerMock('../models/user.model.js', {findByID: saveUserStub});
        const request = {
            body : defaultUser
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController.get(req,res).then(function() {
            expect(res.status).to.be.calledWith(200);
            expect(res.json).to.be.calledWith(mockUser);
        });
    });

});