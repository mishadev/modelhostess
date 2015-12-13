"use strict";

var EventEmitter = require('events');
var Emitter = new EventEmitter();

function Command(type, args) {
    Emitter.emit('command', { type: type, args: args });
}

Command.on = function(handler) {
    Emitter.on('command', handler);
}

Command.off = function(handler) {
    Emitter.removeListener('command', handler);
}

module.exports = Command;
