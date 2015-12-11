"use strict";

var _ = require("lodash");

// var qwest = require('qwest');

var ViewWebClient = {
    UserInfo: function() {
        console.log("UserInfo");

        return {
            then: function(func) {
                _.defer(function() { func(null, {"username": "misha", "password": "misha"}); });
                return this;
            },
            catch: function(func) {
                return this;
            },
            complete: function(func) {
                _.defer(func);
            }
        }
    }
};

module.exports = ViewWebClient;
