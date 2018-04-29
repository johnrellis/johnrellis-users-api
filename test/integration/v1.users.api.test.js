'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const User = require(`${process.cwd()}/routes/v1/schemas/user.schema`);
const log = require('winston');

chai.use(chaiHttp);

describe('users api', function() {

    before(function(done) {
        mongoose.connect(`mongodb://${process.env.MONGODB_HOST}/userservice`);
        let db = mongoose.connection;

        db.on('error', function(error) {
            log.error(error);
            process.exit(1);
        });

        db.once('open', function() {
            log.info('connected to mongo');
            done();
        });
    });

    after(function(done) {
        mongoose.connection.close();
        done();
    });



    afterEach(function(done) {
        User.remove(defaultUser, function() {
            done();
        });
    });

    let defaultUser = {
        email: 'john@home.com'
    };

    it('should be able to create a user', function(done) {
        chai.request('http://localhost:3000')
            .post('/api/v1/users')
            .send(defaultUser)
            .end((err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body.email).to.equal(defaultUser.email);
                //todo : change to expect id
                expect(res.body.id).to.exist;
                done();
            });
    });

    it('should not be able to create a user with a duplicate email address', function(done) {

        let user = new User(defaultUser);
        user.save(function() {
            chai.request('http://localhost:3000')
                .post('/api/v1/users')
                .send(defaultUser)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.body.error).to.equal('E11000 duplicate key error collection: userservice.users index: email_1 dup key: { : "john@home.com" }');
                    done();
                });
        });
    });

    it('should be able to retrieve a user by id', function(done) {
        let user = new User(defaultUser);
        user.save(function() {
            chai.request('http://localhost:3000')
                .get(`/api/v1/users/${user._id}`)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.id).to.equal(user._id.toString());
                    expect(res.body.email).to.equal(user.email);
                    done();
                });
        });
    });

    it('should get a 404 when user does not exist', function(done) {
        chai.request('http://localhost:3000')
            .get('/api/v1/users/5ae5a35ddb5a18d9d04d0b4d')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            });
    });

    it('should get a 404 when user does not exist with invalid mongo object id', function(done) {
        chai.request('http://localhost:3000')
            .get('/api/v1/users/123456')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            });
    });


    it('should be able to delete a user', function(done) {
        let user = new User(defaultUser);
        user.save(function() {
            chai.request('http://localhost:3000')
                .delete(`/api/v1/users/${user._id}`)
                .end((err, res) => {
                    expect(res.status).to.equal(204);
                    done();
                });
        });
    });


    it('should get a 404 when user does not exist when deleting', function(done) {
        chai.request('http://localhost:3000')
            .delete('/api/v1/users/5ae5a35ddb5a18d9d04d0b4d')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            });
    });


    it('should be able to update a user with PUT', function(done) {
        let user = new User(defaultUser);
        user.save(function() {
            chai.request('http://localhost:3000')
                .put(`/api/v1/users/${user._id}`)
                .end((err, res) => {
                    expect(res.status).to.equal(204);
                    done();
                });
        });
    });


    it('should create a user with PUT when no user present', function(done) {
        chai.request('http://localhost:3000')
            .put('/api/v1/users/5ae5a35ddb5a18d9d04d0b4d')
            .send(defaultUser)
            .end((err, res) => {
                expect(res.status).to.equal(201);
                done();
            });
    });
});