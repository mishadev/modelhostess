"use strict";

var _ = require('lodash');
var Test = require('./Test');
var Profile = require('./Profile');

module.exports = _.flatten([Test, Profile]);
