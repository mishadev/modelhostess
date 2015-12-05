"use strict";

var util = require('util');
var Validation = require('../utils/Validation');

function Exception(message) {
    Validation.IsTypeOf(message, 'string');

    this.message = message;
}

Exception.prototype.toString = function exceptionToString() {
    return "Exception: " + this.message;
}

function AbstractMethodCalled(methodName) {
    Exception.call(this, "abstract method was called " + methodName);
}
util.inherits(AbstractMethodCalled, Exception);

function InvalidArgument(argumentName) {
    Exception.call(this, "invalid argument " + argumentName);
}
util.inherits(InvalidArgument, Exception);

module.exports = {
    Exception: Exception,
    AbstractMethodCalled: AbstractMethodCalled,
    InvalidArgument: InvalidArgument
}
