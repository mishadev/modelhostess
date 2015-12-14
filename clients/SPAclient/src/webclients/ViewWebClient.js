"use strict";

var _ = require("lodash");
var qwest = require("qwest");

var ViewWebClient = {
    UserExists: function(username) {
        return qwest.get(
            _.template("http://localhost:3001/api/user/exists/${username}/")({username: username})
        );
    },
    GetUserToken: function(username, password) {
        return qwest.get(
            _.template("http://localhost:3001/api/user/token/?un=${username}&pw=${password}")({username: username, , password: password})
        );
    }
};

module.exports = ViewWebClient;
