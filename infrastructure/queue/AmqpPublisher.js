"use strict";

var amqp = require('amqplib');

var Validation = require('../utils/Validation');
var Emitter = require('./Emitter');

function AmqpPublisher(amqpUrl, queueName, emitter) {
    Validation.IsTypeOf(amqpUrl, 'string');
    Validation.IsTypeOf(queueName, 'string');
    Validation.IsInstanceOf(emitter, Emitter);

    var _connection;

    this.connect = function () {
        var open = amqp.connect(amqpUrl);
        open.then(function(conn) {
            if(_connection) _connection.close();
            _connection = conn;
            process.once('SIGINT', function() { if(_connection) _connection.close(); });

            emitter.subscribe(function(message) {
                _connection.createChannel().then(function(ch) {
                    ch.assertQueue(queueName, {durable: true}).then(function() {
                        ch.sendToQueue(queueName, new Buffer(message), {deliveryMode: true});
                        console.log(" [x] Sent '%s'", message);
                        ch.close();
                    });
                });
            });
        }).then(null, console.warn);
    }

    this.close = function () {
        if(_connection) _connection.close();
        emitter.destroy();
    }
}

module.exports = AmqpPublisher;
