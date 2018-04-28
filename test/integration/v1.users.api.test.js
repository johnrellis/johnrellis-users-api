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
        User.remove({email: 'john@home.com'}, function() {
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
                expect(res.body._id).to.exist;
                done();
            });
    });

    it('should not be able to create a user with a duplicate email address', function(done) {

        let user = new User(defaultUser);
        user.save(function() {
            chai.request('http://localhost:3000')
                .post('/api/v1/users')
                .send({
                    email: 'john@home.com'
                })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    done();
                });
        });
    });

});