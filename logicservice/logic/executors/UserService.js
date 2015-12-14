"use strict";

var _ = require("lodash");

var LogicGateway = require("../../infrastructure/storage/LogicGateway");

var Events = require("../events/Events");

var UserService = {
    createUser: function(command, callback) {
        var user = command.args;
        LogicGateway.getUserInfo({ username: user.username }, function(exists) {
            if(!_.any(exists)) {
                LogicGateway.createUser(user, function(results) {
                    Events("userAdded", user);
                    callback(results);
                });
            } else {
                callback(new Error("user with this name already exists"));
            }
        })
    }
};

module.exports = UserService;
