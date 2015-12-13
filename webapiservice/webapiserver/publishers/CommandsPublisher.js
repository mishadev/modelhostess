"use strict";

var util = require('util');

var _ = require('lodash');

var Emitter = require('../../infrastructure/queue/Emitter');
var Command = require('../commands/Command');

function CommandsPublisher() {
    Emitter.call(this);

    var _publish = _.bind(function(event) {
        this.publish(JSON.stringify(event));
    }, this);
    Command.on(_publish);

    var _destory = this.destory;
    this.destory = function() {
        Command.off(_publish);
        _destory();
    }
}
util.inherits(CommandsPublisher, Emitter);

module.exports = CommandsPublisher;
