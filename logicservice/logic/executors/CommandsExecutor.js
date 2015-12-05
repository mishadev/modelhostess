"use strict";

var util = require('util');
var _ = require('lodash');

var Handler = require('../../infrastructure/queue/Handler');
var LogicGateway = require('../../infrastructure/storage/LogicGateway');

function CommandsExecutor() {
    Handler.call(this);

    var _services = {
        misha: [{
                misha: function(argument, callback) {
                    console.log(JSON.stringify(argument));
                    LogicGateway.SetSome({"misha": "misha"}, callback);
                }
            },
            {
                misha: function(argument, callback) {
                    console.log(JSON.stringify(argument));
                    callback('fuck off');
                }
            }]
    };

    var _createAggrigationCallback = function(count, callback) {
        var results = [];
        return function(result) {
            results.push(result);
            console.log(' Done ' + results.length + '/' + count);
            if (results.length === count) callback(results);
        }
    };

    this.handle = function handle(command, callback) {
        var handlers = _.get(_services, command.type);
        if(!_.any(handlers)) return callback();

        var cb = _createAggrigationCallback(handlers.length, callback);
        _.each(handlers, function(handler) {
            var method = handler[command.type];
            if (_.isFunction(method)) {
                method.call(handler, command, cb);
            } else {
                console.error(command.type + ' is not a function');
            }
        });
    };
}
util.inherits(CommandsExecutor, Handler);

module.exports = CommandsExecutor;
