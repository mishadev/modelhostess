"use strict";

var util = require('util');

var _ = require('lodash');
var EventEmitter = require('events');

var Emitter = require('../../infrastructure/queue/Emitter');

function EventsPublisher() {
    Emitter.call(this);

    var _eventHandler = _.bind(function _eventHandler(event) {
        //create message
        var message = event;
        this.publish(message);
    }, this);

    var e = new EventEmitter();
    var z = 0;
    var x = setInterval(function(argument) {
        e.emit('event', '{"type":"misha","privet":"misha", "idx":"' + z + '"}');
        if(z++ > 10) clearInterval(x);
    }, 1000);

    var _services = [e];
    _.each(_services, function(service) {
        service.on('event', _eventHandler);
    })
}
util.inherits(EventsPublisher, Emitter);

module.exports = EventsPublisher;
