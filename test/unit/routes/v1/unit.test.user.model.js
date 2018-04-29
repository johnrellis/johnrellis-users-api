'use strict';

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const mockery = require('mockery');
const version = require('./version');

describe('user.create', function() {
    let sandbox = null;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        mockery.enable();
    });

    afterEach(function() {
        sandbox.restore();
        mockery.deregisterAll();
        mockery.disable();
    });

    let defaultUser = {
        email: 'john@home.com'
    };
    let userModel = require(`${process.cwd()}/routes/${version}/models/user.model`);

    it('should be able to save', function(done) {
        let mockModel = function() {};
        mockModel.prototype.save = function() {
            return 'saved';
        };
        mockery.registerMock('../schemas/user.schema.js', mockModel);
        expect(userModel.save(defaultUser)).to.equal('saved');
        done();
    });

    it('should be able to findByID', function(done) {
        let mockModel = {
            findById () {
                return 'findById';
            }
        };
        mockery.registerMock('../schemas/user.schema.js', mockModel);
        expect(userModel.findByID(defaultUser)).to.equal('findById');
        done();
    });

});