"use strict";

var amqp = require('amqplib');

var Validation = require('../utils/Validation');
var Handler = require('./Handler');

function AmqpConsumer(amqpUrl, queueName, handler) {
    Validation.IsTypeOf(amqpUrl, 'string');
    Validation.IsTypeOf(queueName, 'string');
    Validation.IsInstanceOf(handler, Handler);

    var _connection;

    var _tryParse = function tryParse(input) {
        try { return JSON.parse(input); }
        catch (e) { return input; }
    }

    this.connect = function () {
        var open = amqp.connect(amqpUrl);
        open.then(function(conn) {
            if(_connection) _connection.close();
            _connection = conn;
            process.once('SIGINT', function() { if(_connection) _connection.close(); });

            return _connection.createChannel().then(function(ch) {
                var ok = ch.assertQueue(queueName, {durable: true});

                ok = ok.then(function() { ch.prefetch(1); })
                return ok.then(function() {
                    ch.consume(queueName, _doWork, {noAck: false});
                    console.log(" [*] Waiting for messages. To exit press CTRL+C");
                });

                function _doWork(msg) {
                    var body = msg.content.toString();
                    console.log(" [x] Received '%s'", body);
                    var start = Date.now();
                    handler.handle(_tryParse(body), function(message) {
                        console.log(" [x] Task takes %d ms", Date.now() - start);
                        ch.ack(msg);
                        console.log(" [x] Done");
                    });
                }
            });
        }).then(null, console.warn);
    }

    this.close = function () {
        if(_connection) _connection.close();
    }
}

module.exports = AmqpConsumer;
