"use strict";

function _build(options) {
    var amqpUserinfo = options.username + ":" + options.password;
    var amqpAuthority = amqpUserinfo + "@" + options.host + ":" + options.port;

    var amqpVhost = "%2F";
    var amqpUrl = "amqp://" + amqpAuthority + "/" + amqpVhost;

    return amqpUrl;
}

module.exports = { build: _build };
