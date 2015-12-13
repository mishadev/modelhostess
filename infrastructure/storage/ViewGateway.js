"use strict";

var Client = require('mongodb').MongoClient;
var Validation = require('../utils/Validation');

var mongoUrl = 'mongodb://' + process.env.VIEWDB_PORT_27017_TCP_ADDR + ':' + process.env.VIEWDB_PORT_27017_TCP_PORT + '/views';

function _userExists(username, callback) {
    Client.connect(mongoUrl, function(error, db) {
        console.log("open connection to " + mongoUrl);
        Validation.IsNull(error);

        var collection = db.collection('UserExists');
        collection.find({ username: username }).toArray(function(error, result) {
            Validation.IsNull(error);

            db.close();
            console.log("close connection to " + mongoUrl);
            callback(result);
        });
    });
}

function _insertUserExists(user, callback) {
    Client.connect(mongoUrl, function(error, db) {
        console.log("open connection to " + mongoUrl);
        Validation.IsNull(error);

        var collection = db.collection('UserExists');
        collection.insert(user, function(err, result) {
            Validation.IsNull(error);

            db.close();
            console.log("close connection to " + mongoUrl);
            callback(result);
        });
    });
}

module.exports = {
    userExists: _userExists,
    insertUserExists: _insertUserExists
}
