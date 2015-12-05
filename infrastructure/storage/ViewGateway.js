"use strict";

var Client = require('mongodb').MongoClient;
var Validation = require('../utils/Validation');

var mongoUrl = 'mongodb://' + process.env.VIEWDB_PORT_27017_TCP_ADDR + ':' + process.env.VIEWDB_PORT_27017_TCP_PORT + '/views';

function _getProfiles(criteria, callback) {
    Client.connect(mongoUrl, function(error, db) {
        console.log("open connection to " + mongoUrl);
        Validation.IsNull(error);

        var collection = db.collection('Profiles');
        collection.find(criteria).toArray(function(error, result) {
            Validation.IsNull(error);

            db.close();
            console.log("close connection to " + mongoUrl);
            callback(result);
        });
    });
}

function _insertProfile(profile, callback) {
    Client.connect(mongoUrl, function(error, db) {
        console.log("open connection to " + mongoUrl);
        Validation.IsNull(error);

        var collection = db.collection('Profiles');
        collection.insert(profile, function(err, result) {
            Validation.IsNull(error);

            db.close();
            console.log("close connection to " + mongoUrl);
            callback(result);
        });
    });
}

module.exports = {
    GetProfiles: _getProfiles,
    InsertProfile: _insertProfile
}
