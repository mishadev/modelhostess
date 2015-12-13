"use strict";

var _ = require('lodash');
var EventEmitter = require('events');

function Emitter() {
    var _emmiter = new EventEmitter();
    var _handlers = [];

    this.subscribe = function subscribe(handler) {
        _handlers.push(handler);
        _emmiter.on('message', handler);
    }
    this.publish = function publish(message) {
        console.log(message);
        _emmiter.emit('message', message);
    }
    this.destroy = function destroy() {
        _.each(_handlers, function(handler) {
            _emmiter.removeListener('message', handler);
        });
        _handlers = [];
    }
}

module.exports = Emitter;
