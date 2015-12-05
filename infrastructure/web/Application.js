"use strict";

var Exceptions = require('./Exceptions');
var AbstractMethodCalled = Exceptions.AbstractMethodCalled;

function Application() {
    this.instance = function() {
        throw new AbstractMethodCalled('instance');
    }
    this.registerAll = function(routes) {
        throw new AbstractMethodCalled('registerAll');
    }
    this.register = function(route) {
        throw new AbstractMethodCalled('register');
    }
}

module.exports = Application;
