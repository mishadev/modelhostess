"use strict";

var qwest = require('qwest');

var ApiWebClient = {
    AuthenticateUser: function(username, password) {
        return qwest.post('http://localhost:3000/api/auth/', {
            username: username,
            password: password
        }, {
            dataType: 'json'
        });
    },
    CreateUser: function(username, password) {
        return qwest.post('http://localhost:3000/api/users/create', {
            username: username,
            password: password
        }, {
            dataType: 'json'
        });
    }
};

module.exports = ApiWebClient;
