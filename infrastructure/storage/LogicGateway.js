"use strict";

var Client = require('mongodb').MongoClient;
var Validation = require('../utils/Validation');

var mongoUrl = 'mongodb://' + process.env.LOGICDB_PORT_27017_TCP_ADDR + ':' + process.env.LOGICDB_PORT_27017_TCP_PORT + '/models';

function _getSome(criteria, callback) {
    Client.connect(mongoUrl, function(error, db) {
        console.log("open connection to " + mongoUrl);
        Validation.IsNull(error);

        var collection = db.collection('Some');
        collection.find(criteria).toArray(function(error, result) {
            Validation.IsNull(error);

            db.close();
            console.log("close connection to " + mongoUrl);
            callback(result);
        });
    });
}

function _setSome(data, callback) {
    Client.connect(mongoUrl, function(error, db) {
        console.log("open connection to " + mongoUrl);
        Validation.IsNull(error);

        var collection = db.collection('Some');
        collection.insert(data, function(err, result) {
            Validation.IsNull(error);

            db.close();
            console.log("close connection to " + mongoUrl);
            callback(result);
        });
    });
}

module.exports = {
    GetSome: _getSome,
    SetSome: _setSome
}
