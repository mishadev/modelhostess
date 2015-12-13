"use strict";

var _ = require('lodash');

var UrlBuilder = require('../../infrastructure/queue/UrlBuilder');
var AmqpPublisher = require('../../infrastructure/queue/AmqpPublisher');

var CommandsPublisher = require('./CommandsPublisher');

function setup() {
    var amqpUrl = UrlBuilder.build({
        username: process.env.RABBITMQ_DEFAULT_USER,
        password: process.env.RABBITMQ_DEFAULT_PASS,
        host: process.env.MQSERVER_PORT_5672_TCP_ADDR,
        port: process.env.MQSERVER_PORT_5672_TCP_PORT
    });

    var publisher = new AmqpPublisher(amqpUrl, process.env.EVENT_QUEUE_NAME, new CommandsPublisher());

    _.delay(publisher.connect.bind(publisher), 5000);
}

module.exports = setup;

