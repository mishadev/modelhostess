"use strict";

var LogicGateway = require('../../infrastructure/storage/LogicGateway');

var Events = require('../events/Events');

var UserService = {
    createUser: function(user, callback) {
        LogicGateway.getUserInfo({ username: user.username }, function(user) {
            if(!user) LogicGateway.createUser(user, function(results) {
                Events("useAdded", user);
                callback(results);
            });
            callback(new Error("user with this name already exists"));
        })
    }
};
