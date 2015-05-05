var sinon = require('sinon');
var should = require('should');
var neo4j = require('neo4j');
var md5 = require('MD5');
var requireHelper = require('../../require_helper');
var UserModel = requireHelper('model/UserModel');


var config = {
    db: {
        url: 'http://localhost:7474'
    }
};


describe('User Repository test', function () {
    var sandbox, userModel;

    var testUserData = [{
        user: {
            id: 1234,
            data: {
                uid: 'test',
                passwordMD5: 'qwert'
            }
        },
        Group: 'Testgruppe'
    }];


    beforeEach(function () {
        sandbox = sinon.sandbox.create();

    });

    afterEach(function () {
        sandbox.restore();
    });


    describe('Test creation of a new user', function () {

        it('Test if constructor works', function () {
            userModel = new UserModel();
            should(userModel == null).eql(false);
        });

        it('Test if create User With Person returns user created by db', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testUserData);
            });

            var testData = {
                uid: 'test',
                forename: 'Test',
                surname: 'Test',
                birthday: 1345,
                email: 'test@sss',
                phone: '1345'
            };

            userModel = new UserModel();
            userModel.createUserWithPerson('test', 'prodyna', testData, function (err, createdUser) {
                should.not.exist(err);
                should(createdUser.id).be.equal(1234);
                should(createdUser.uid).be.equal('test');
                should(createdUser.passwordMD5).be.equal('secure');
                done();
            });

        });

        it('Test if error thrown if illegal data count comes from db', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                var illegalData = [];
                illegalData.push(testUserData[0]);
                illegalData.push(testUserData[0]);
                callback(null, illegalData);
            });


            var testData = {
                uid: 'test',
                forename: 'Test',
                surname: 'Test',
                birthday: 1345,
                email: 'test@sss',
                phone: '1345'
            };

            userModel = new UserModel();
            userModel.createUserWithPerson('test', 'prodyna', testData, function (err, createdUser) {
                should(createdUser).be.equal(undefined);
                should.exist(err);
                done();
            });

        });


        it('Test if create User With Person returns no result (fails)', function (done) {
            var testUserData = [];
            var testData = {
                uid: 'test',
                forename: 'Test',
                surname: 'Test',
                birthday: 1345,
                email: 'test@sss',
                phone: '1345'
            };

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, testUserData);
            });

            userModel = new UserModel();
            userModel.createUserWithPerson('test', 'prodyna', testData, function (err, createdUser) {
                should.not.exist(err);
                should(createdUser).be.equal(false);
                done();
            });

        });


        it('Test if db called with correct attributes', function (done) {
            var testUserData = [{
                user: {
                    id: 1234,
                    data: {
                        uid: 'test',
                        passwordMD5: 'qwert'
                    }
                },
                Group: 'Testgruppe'
            }];
            var testData = {
                uid: 'test',
                forename: 'Test',
                surname: 'Test',
                birthday: 1345,
                email: 'test@sss',
                phone: '1345'
            };
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                should(data).have.property('forename');
                should(data).have.property('surname');
                should(data.forename).be.eql('Test');
                should(data.surname).be.eql('Test');
                done();
            });

            userModel = new UserModel();
            userModel.createUserWithPerson('test', 'prodyna', testData, function (err, createdUser) {
            });

        });


    });


    describe('Test finding of user', function () {
        it('Test if db query was called correctly', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                should(data).have.property('uid');
                should(data.uid).be.equal('Tester');
                callback(null, testUserData);
            });


            userModel.findUser('Tester', function (err, foundUser) {
                should(foundUser.id).be.equal(1234);
                should(foundUser.uid).be.equal('test');
                should(foundUser.passwordMD5).be.equal('secure');
                done();
            });
        });


        it('Test if no result returns if nothing found', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, []);
            });


            userModel.findUser('Tester', function (err, foundUser) {
                should.not.exist(err);
                should(foundUser).be.equal(false);
                done();
            });
        });

        it('Test if error thrown if more then one user found', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                var illegalData = [];
                illegalData.push(testUserData[0]);
                illegalData.push(testUserData[0]);
                callback(null, illegalData);
            });


            userModel.findUser('Tester', function (err, foundUser) {
                should(foundUser).be.equal(undefined);
                should.exist(err);
                done();
            });
        });
    });


    describe('Test resolving of existing user', function () {

        it('Test if db returned user was filled correctly', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {

                should(data).have.property('uid');
                should(data.uid).be.equal('Tester');

                var resolvedUser = [{
                    user: testUserData[0].user,
                    MainGroup: 'User',
                    OtherGroups: 'Manager,Admin'
                }];
                callback(null, resolvedUser);
            });

            userModel.resolveUser('Tester', function (err, foundUser) {
                should.not.exist(err);
                should(foundUser.id).be.equal(1234);
                should(foundUser.uid).be.equal('test');
                should(foundUser.passwordMD5).be.equal('secure');

                should(foundUser.groups.length).be.equal(3);
                should(foundUser.groups[0]).be.equal('User');
                should(foundUser.groups[1]).be.equal('Manager');
                should(foundUser.groups[2]).be.equal('Admin');

                done();
            });
        });

        it('Test if false returned if no user found', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                callback(null, []);
            });

            userModel.resolveUser('Tester', function (err, foundUser) {
                should.not.exist(err);
                should(foundUser).be.equal(false);
                done();
            });
        });


        it('Test if error thrown if more then one user found', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, data, callback) {
                var illegalData = [];
                illegalData.push(testUserData[0]);
                illegalData.push(testUserData[0]);
                callback(null, illegalData);
            });


            userModel.findUser('Tester', function (err, foundUser) {
                should(foundUser).be.equal(undefined);
                should.exist(err);
                done();
            });
        });

        it('Test if error thrown if resolving with user null', function (done) {
            userModel.resolveUser(null, function (err, foundUser) {
                should.exist(err);
                done();
            });
        });


        it('Test if user data can be updated', function (done) {
            var user = {
                id: 319032,
                uid: 'rmachno',
                passwordMD5: 'trea',
                registrationDate: 1429910158152,
                groups: [
                    'User'
                ]
            };

            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, params, callback) {
                should(params.uid).be.equal(319032);

                callback(null, [{
                    user: {
                        id: 319032,
                        data: {
                            id: 319032,
                            uid: 'rmachno1',
                            passwordMD5: 'oqwefimweofwoefn',
                            registrationDate: 1429910158152
                        }
                    },
                    MainGroup: 'User'
                }]);
            });

            sandbox.stub(neo4j.GraphDatabase.prototype, 'getNodeById', function (searchId, callback) {
                should(searchId).be.equal(319032);

                callback(null, {
                    id: 330765,
                    data: {
                        id: 319032,
                        uid: 'rmachno1',
                        passwordMD5: 'oqwefimweofwoefn',
                        registrationDate: 1429910158152
                    },
                    save: function (callback) {
                        callback(null, this);
                    }
                });
            });

            userModel.updateUser(319032, user, function (err, updatedPerson) {
                should.not.exist(err);
                should.exist(updatedPerson);

                should(updatedPerson.uid).be.equal('rmachno');
                should(updatedPerson.passwordMD5).be.equal('secure');
                done();
            });
        });


        it('Test if no update id user data is null', function (done) {

            userModel.updateUser(15, null, function (err, updatedPerson) {
                should.exist(err);
                should.not.exist(updatedPerson);
                done();
            });
        });


        it('Test if listing of users returns them secured', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, params, callback) {
                callback(null, [{
                    user: {
                        id: 319032,
                        data: {
                            id: 319032,
                            uid: 'rmachno1',
                            passwordMD5: 'oqwefimweofwoefn',
                            registrationDate: 1429910158152
                        }
                    },
                    MainGroup: 'User'
                }, {
                    user: {
                        id: 319041,
                        data: {
                            id: 319041,
                            uid: 'rmachno2',
                            passwordMD5: 'fwsesefsefse',
                            registrationDate: 1429910158152
                        }
                    },
                    MainGroup: 'User'
                }]);
            });
            userModel.listUsers(function (err, listUsers) {
                should.not.exist(err);
                should.exist(listUsers);

                should(listUsers.length).be.equal(2);
                should(listUsers[0].passwordMD5).be.equal('secure');
                should(listUsers[1].passwordMD5).be.equal('secure');
                done();
            });
        });


        it('Test if changing of user group works', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, params, callback) {
                should(params.uid).be.equal(1500);

                callback(null, [{
                    user: {
                        id: 1500,
                        data: {
                            id: 1500,
                            uid: 'rmachno1',
                            passwordMD5: md5('x'),
                            registrationDate: 1429910158152
                        }
                    },
                    MainGroup: 'User'
                }]);
            });

            sandbox.stub(neo4j.GraphDatabase.prototype, 'getNodeById', function (searchId, callback) {

                var userNode = {
                    id: 1500,
                    data: {
                        id: 1500,
                        uid: 'rmachno1',
                        passwordMD5: 'secure',
                        registrationDate: 1429910158152
                    },
                    getRelationships: function (rel, callback) {
                        return callback(null, [{
                            del: function (callback) {
                                callback(null);
                            }
                        }]);
                    },
                    createRelationshipTo: function (node, relName, data, callback) {
                        callback(null, {});
                    }
                };

                var groupNode = {
                    id: 5,
                    data: {
                        name: 'User'
                    }
                };
                if (searchId === 1500) {
                    callback(null, userNode);
                } else if (searchId === 5) {
                    callback(null, groupNode);
                }
            });

            userModel.changeUserGroup(1500, 5, function (err, result) {
                should.not.exist(err);
                should.exist(result);
                should(result).be.equal(true);
                done();
            });
        });


        it('Test if changing of user group by illegal data throws exception', function (done) {
            userModel.changeUserGroup(null, null, function (err, result) {
                should.exist(err);
            });

            userModel.changeUserGroup(5, null, function (err, result) {
                should.exist(err);
            });
            done();
        });


        it('Test if password reset works', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, params, callback) {
                should(params.uid).be.equal(1500);

                callback(null, [{
                    user: {
                        id: 1500,
                        data: {
                            id: 1500,
                            uid: 'rmachno1',
                            passwordMD5: md5('x'),
                            registrationDate: 1429910158152
                        }
                    },
                    MainGroup: 'User'
                }]);
            });

            sandbox.stub(neo4j.GraphDatabase.prototype, 'getNodeById', function (searchId, callback) {
                should(searchId).be.equal(1500);

                callback(null, {
                    id: 1500,
                    data: {
                        id: 1500,
                        uid: 'rmachno1',
                        passwordMD5: 'secure',
                        registrationDate: 1429910158152
                    },
                    save: function (callback) {
                        callback(null, this);
                    }
                });
            });

            userModel.resetUserPassword(1500, function (err, result) {
                should.not.exist(err);
                should.exist(result);
                done();
            });
        });


        it('Test if password change of user works', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, params, callback) {
                should(params.uid).be.equal(1500);

                callback(null, [{
                    user: {
                        id: 1500,
                        data: {
                            id: 1500,
                            uid: 'rmachno1',
                            passwordMD5: md5('x'),
                            registrationDate: 1429910158152
                        }
                    },
                    MainGroup: 'User'
                }]);
            });

            sandbox.stub(neo4j.GraphDatabase.prototype, 'getNodeById', function (searchId, callback) {
                should(searchId).be.equal(1500);

                callback(null, {
                    id: 1500,
                    data: {
                        id: 1500,
                        uid: 'rmachno1',
                        passwordMD5: 'secure',
                        registrationDate: 1429910158152
                    },
                    save: function (callback) {
                        should(this.data.passwordMD5).be.equal(md5('y'));
                        callback(null, this);
                    }
                });
            });

            userModel.changeUserPassword(1500, {oldPassword: 'x', newPassword: 'y'}, function (err, result) {
                should.not.exist(err);
                should(result).be.equal(true);
                done();
            });
        });


        it('Test if password change with wrong old passwor dont work', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, params, callback) {
                should(params.uid).be.equal(1500);

                callback(null, [{
                    user: {
                        id: 1500,
                        data: {
                            id: 1500,
                            uid: 'rmachno1',
                            passwordMD5: md5('xy'),
                            registrationDate: 1429910158152
                        }
                    },
                    MainGroup: 'User'
                }]);
            });

            userModel.changeUserPassword(1500, {oldPassword: 'x', newPassword: 'y'}, function (err, result) {
                should.exist(err);
                done();
            });
        });


        it('Test if password change withoud data must throw exception', function (done) {
            userModel.changeUserPassword(1500, {oldPassword: null, newPassword: null}, function (err, result) {
                should.exist(err);

            });

            userModel.changeUserPassword(1500, null, function (err, result) {
                should.exist(err);
            });

            done();
        });


        it('Test if user data is validated', function (done) {
            var user = {
                id: 330765,
                uid: null,
                passwordMD5: null,
                registrationDate: null
            };


            userModel.updateUser(15, user, function (err, updatedPerson) {
                should.exist(err);

                done();
            });

        });

    });

    describe('Test handling with person', function () {

        it('Test if person data can be updated', function (done) {
            var person = {
                id: 330765,
                forename: 'Max',
                surname: 'Mustermann',
                birthday: 1422918000000,
                email: 'test@ccc.com',
                phone: '123412412440'
            };

            sandbox.stub(neo4j.GraphDatabase.prototype, 'getNodeById', function (searchId, callback) {
                should(searchId).be.equal(330765);

                callback(null, {
                    id: 330765,
                    data: {
                        forename: 'Michael',
                        surname: 'Dobrint',
                        birthday: 1422918000100,
                        email: 'test@ccc.de',
                        phone: '123412412444'
                    },
                    save: function (callback) {
                        callback(null, this);
                    }
                });
            });

            userModel.updatePerson(person, function (err, updatedPerson) {
                should.not.exist(err);
                should.exist(updatedPerson);

                should(updatedPerson.forename).be.equal('Max');
                should(updatedPerson.surname).be.equal('Mustermann');
                should(updatedPerson.birthday).be.equal(1422918000000);
                should(updatedPerson.email).be.equal('test@ccc.com');
                should(updatedPerson.phone).be.equal('123412412440');
                done();
            });
        });

        it('Test if person data is validated', function (done) {
            var person = {
                id: 330765,
                forename: null,
                surname: null,
                birthday: null,
                email: null,
                phone: null
            };

            userModel.updatePerson(person, function (err, updatedPerson) {
                should.exist(err);

                done();
            });

        });


        it('Test if person data null throws exception', function (done) {

            userModel.updatePerson(null, function (err, updatedPerson) {
                should.exist(err);
                done();
            });
        });

        it('Test listing of persons returns the list of them', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, param, callback) {
                callback(null, [
                    {
                        person: {
                            id: 330765,
                            data: {
                                forename: 'Michael',
                                surname: 'Dobrint',
                                birthday: 1422918000100,
                                email: 'test@ccc.de',
                                phone: '123412412444'
                            }
                        }
                    },
                    {
                        person: {
                            id: 330769,
                            data: {
                                forename: 'Test',
                                surname: 'Schmidt',
                                birthday: 1422918000100,
                                email: 'test@ccc.de',
                                phone: '123412412444'
                            }
                        }
                    }
                ]);
            });

            userModel.listPersons(function (err, personList) {
                should.not.exist(err);
                should.exist(personList);
                should(personList.length).be.equal(2);
                done();
            });
        });


        it('Test listing of roles returns the list of them', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, param, callback) {
                callback(null, [
                    {
                        role: 'Tester'
                    },
                    {
                        role: 'Architect'
                    }
                ]);
            });

            userModel.listRoles(function (err, rolesList) {
                should.not.exist(err);
                should.exist(rolesList);
                should(rolesList.length).be.equal(2);
                done();
            });
        });


        it('Test listing of groups returns the list of them', function (done) {
            sandbox.stub(neo4j.GraphDatabase.prototype, 'query', function (query, param, callback) {
                callback(null, [
                    {
                        group: {
                            id: 100,
                            data: {
                                name: 'User',
                                description: 'User account'
                            }
                        }
                    },
                    {
                        group: {
                            id: 200,
                            data: {
                                name: 'Manager',
                                description: 'Manager account'
                            }
                        }
                    }
                ]);
            });

            userModel.listGroups(function (err, groupsList) {
                should.not.exist(err);
                should.exist(groupsList);
                should(groupsList.length).be.equal(2);
                done();
            });
        });


        it('Test if error thrown if resolving with userid null', function (done) {
            userModel.resolveUserPerson(null, function (err, foundUser) {
                should.exist(err);
                done();
            });
        });

        it('Test if resolving of person by user id works', function (done) {

            sandbox.stub(neo4j.GraphDatabase.prototype, 'getNodeById', function (searchId, callback) {
                should(searchId).be.equal(1700);

                callback(null, {
                    id: 1700,
                    data: {
                        id: 1700,
                        uid: 'rmachno1',
                        passwordMD5: 'oqwefimweofwoefn',
                        registrationDate: 1429910158152
                    },
                    getRelationshipNodes: function (node, callback) {
                        callback(null, [{
                            id: 1345,
                            data: {
                                forename: 'Test',
                                surname: 'Schmidt',
                                birthday: 1422918000100,
                                email: 'test@ccc.de',
                                phone: '123412412444'
                            }
                        }]);
                    }
                });
            });


            userModel.resolveUserPerson({id: 1700}, function (err, foundPerson) {
                should.not.exist(err);

                should.exist(foundPerson);
                should(foundPerson.id).be.equal(1345);
                should(foundPerson.forename).be.equal('Test');
                should(foundPerson.surname).be.equal('Schmidt');
                done();
            });
        });


    });
});