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
        User.find({$or: [{email: defaultUser.email}, {email: updatedUser.email}]}).remove(function() {
            done();
        });
    });

    let defaultUser = {
        email: 'john@home.com'
    };

    let updatedUser = {
        email: 'johnagain@home.com'
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
                .send(updatedUser)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.email).to.equal(updatedUser.email);
                    chai.request('http://localhost:3000')
                        .get(`/api/v1/users/${user._id}`)
                        .end((err, res) => {
                            expect(res.status).to.equal(200);
                            expect(res.body.email).to.equal(updatedUser.email);
                            done();
                        });
                });
        });
    });


    it('should create a user with PUT when no user present', function(done) {
        chai.request('http://localhost:3000')
            .put('/api/v1/users/5ae5a35ddb5a18d9d04d0b4e')
            .send(defaultUser)
            .end((err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body.email).to.equal(defaultUser.email);
                chai.request('http://localhost:3000')
                    .get('/api/v1/users/5ae5a35ddb5a18d9d04d0b4e')
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body.id).to.equal('5ae5a35ddb5a18d9d04d0b4e');
                        done();
                    });
            });
    });


    describe('user querying', function() {
        let users = [];

        beforeEach(function(done) {
            this.timeout(5000);
            users = [];
            for(let i=0;i<200;i++){
                let user ={
                    email:`john${i}@email.com`
                };
                users.push(user);
            }
            User.create(users, function(err) {
                if(err){
                    log.error(err); 
                } else {
                    done();
                }              
            });
        });

        afterEach(function(done) {
            this.timeout(5000);
            User.find({$or: users}).remove(function() {
                done();
            });
        });


        it('should be able to query for a list of users with default page size of 10', function(done) {
            chai.request('http://localhost:3000')
                .get('/api/v1/users')
                .send(defaultUser)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(10);
                    done();
                });
        }); 

        it('should be able to query for user by email address', function(done) {
            chai.request('http://localhost:3000')
                .get('/api/v1/users')
                .query({email:'john50@email.com'})
                .send(defaultUser)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    expect(res.body[0].email).to.equal('john50@email.com');
                    done();
                });
        }); 

        it('should be able to query for and sort by email with no offset and limit of 5', function(done) {
            chai.request('http://localhost:3000')
                .get('/api/v1/users')
                .query({sort:'email', limit:5, offset:0})
                .send(defaultUser)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(5);
                    expect(res.body[0].email).to.equal('john0@email.com');
                    expect(res.body[1].email).to.equal('john100@email.com');
                    expect(res.body[2].email).to.equal('john101@email.com');
                    expect(res.body[3].email).to.equal('john102@email.com');
                    expect(res.body[4].email).to.equal('john103@email.com');

                    done();
                });
        }); 

        it('should be able to query for and sort by email desc with no offset and limit of 5', function(done) {
            chai.request('http://localhost:3000')
                .get('/api/v1/users')
                .query({sort:'-email', limit:5, offset:0})
                .send(defaultUser)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(5);
                    expect(res.body[0].email).to.equal('john9@email.com');
                    expect(res.body[1].email).to.equal('john99@email.com');
                    expect(res.body[2].email).to.equal('john98@email.com');
                    expect(res.body[3].email).to.equal('john97@email.com');
                    expect(res.body[4].email).to.equal('john96@email.com');
                    done();
                });
        }); 

        it('should be able to query for and sort by email desc with offset of 5 and limit of 5', function(done) {
            chai.request('http://localhost:3000')
                .get('/api/v1/users')
                .query({sort:'-email', limit:5, offset:5})
                .send(defaultUser)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(5);
                    expect(res.body[0].email).to.equal('john95@email.com');
                    expect(res.body[1].email).to.equal('john94@email.com');
                    expect(res.body[2].email).to.equal('john93@email.com');
                    expect(res.body[3].email).to.equal('john92@email.com');
                    expect(res.body[4].email).to.equal('john91@email.com');
                    done();
                });
        }); 

        it('should be able to query for a max of 100', function(done) {
            chai.request('http://localhost:3000')
                .get('/api/v1/users')
                .query({sort:'-email', limit:200, offset:0})
                .send(defaultUser)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(100);
                    done();
                });
        }); 

    });



});