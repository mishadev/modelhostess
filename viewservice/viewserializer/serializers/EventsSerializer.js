"use strict";

var util = require('util');
var _ = require('lodash');

var Handler = require('../../infrastructure/queue/Handler');
var ViewGateway = require('../../infrastructure/storage/ViewGateway');

var ProfileSerializer = require('./ProfileSerializer');

function EventsSerializer() {
    Handler.call(this);

    var _services = {
        misha: [new ProfileSerializer()]
    };

    var _createAggrigationCallback = function(count, callback) {
        var results = [];
        return function(result) {
            results.push(result);
            console.log(' Done ' + results.length + '/' + count);
            if (results.length === count) callback(results);
        }
    };

    this.handle = function handle(event, callback) {
        var handlers = _.get(_services, event.type);
        if(!_.any(handlers)) return callback();

        var cb = _createAggrigationCallback(handlers.length, callback);
        _.each(handlers, function(handler) {
            var method = handler.handel;
            if (_.isFunction(method)) {
                method.call(handler, event, cb);
            } else {
                console.error(event.type + ' is not a function');
            }
        });
    };
}
util.inherits(CommandsExecutor, Handler);

module.exports = CommandsExecutor;
