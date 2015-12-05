"use strict";

var util = require('util');

var ViewGateway = require('../../infrastructure/storage/ViewGateway');
var Handler = require('../../infrastructure/queue/Handler');

function ProfileSerializer() {
    Handler.call(this);

    this.handle = function handle(event, callback) {
        ViewGateway.InsertProfile(event, callback);
    }
}
util.inherits(ProfileSerializer, Handler);

module.exports = ProfileSerializer;
