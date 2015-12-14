"use strict";

var qwest = require('qwest');
qwest.setDefaultDataType('json');

var ApiWebClient = {
    CreateUser: function(username, password) {
        return qwest.post('http://localhost:3000/api/users/create', {
            username: username,
            password: password
        });
    }
};

module.exports = ApiWebClient;
