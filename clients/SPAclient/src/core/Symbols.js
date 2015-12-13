"use strict";

var _ = require("lodash");

var Symbols = [
    "AuthenticateUser",
    "CreateUser",

    "UserInfo",
    "UserExists"
];

module.exports = _.mapKeys(Symbols, _.indentity);
