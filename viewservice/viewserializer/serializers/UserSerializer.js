"use strict";

var _ = require("lodash");

var ViewGateway = require("../../infrastructure/storage/ViewGateway");

var UserSerializer = {
    userAdded: function(event, callback) {
        ViewGateway.insertUserExists(_.pick(event.user, "username"), callback);
    }
}

module.exports = UserSerializer;
