"use strict";

var EventEmitter = require('events');
var Emitter = new EventEmitter();

function Events(type, args) {
    Emitter.emit('event', { type: type, args: args });
}

Events.on = function(handler) {
    Emitter.on('event', handler);
}

Events.off = function(handler) {
    Emitter.removeListener('event', handler);
}

module.exports = Events;
