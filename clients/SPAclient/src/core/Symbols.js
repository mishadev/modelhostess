"use strict";

var _ = require("lodash");

var Symbols = [
    "AuthenticateUser",
    "CreateUser",

    "UserInfo"
];

module.exports = _.mapKeys(Symbols, _.indentity);
