"use strict";

var _ = require('lodash');
// var qwest = require('qwest');

var ApiWebClient = {
    AuthenticateUser: function(username, password) {
        console.log("AuthenticateUser");
        console.log(username);
        console.log(password);

        return {
            then: function(func) {
                _.defer(func);
                return this;
            },
            catch: function(func) {
                return this;
            }
        }
    },
    CreateUser: function(username, password) {
        console.log("CreateUser");
        console.log(username);
        console.log(password);

        return {
            then: function(func) {
                _.defer(func);
                return this;
            },
            catch: function(func) {
                return this;
            }
        }
    }
};

module.exports = ApiWebClient;
