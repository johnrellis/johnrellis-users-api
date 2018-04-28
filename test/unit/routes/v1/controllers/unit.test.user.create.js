'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
//import { mockReq, mockRes } from 'sinon-express-mock'
const mockReq = require('sinon-express-mock').mockReq;
const mockRes = require('sinon-express-mock').mockRes;
const mockery = require('mockery');


chai.use(sinonChai);


describe('user.create', function() {
    let sandbox = null;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        mockery.enable();
    });

    afterEach(function() {
        sandbox.restore();
        mockery.disable();
    });

    let userCreateController = require(`${process.cwd()}/routes/v1/controllers/user/user.create`);

    let defaultUser = {
        email: 'john@home.com'
    };

    it('should be able to create a user', function() {
        let saveUserStub = sinon.sandbox.stub().resolves({hello:'there'});

        mockery.registerMock('../../models/user.js', {save: saveUserStub});
        const request = {
            body : defaultUser
        };
        const req = mockReq(request);
        const res = mockRes();
        return userCreateController(req,res).then(function() {
            expect(res.status).to.be.calledWith(201);
        });
    });

});