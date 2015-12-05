#!/usr/bin/env node

"use strict";

var _ = require('lodash');

var UrlBuilder = require('../../infrastructure/queue/UrlBuilder');
var AmqpConsumer = require('../../infrastructure/queue/AmqpConsumer');
var AmqpPublisher = require('../../infrastructure/queue/AmqpPublisher');

var CommandsExecutor = require('../executors/CommandsExecutor');
var EventsPublisher = require('../publishers/EventsPublisher');

var amqpUrl = UrlBuilder.build({
    username: process.env.RABBITMQ_DEFAULT_USER,
    password: process.env.RABBITMQ_DEFAULT_PASS,
    host: process.env.MQSERVER_PORT_5672_TCP_ADDR,
    port: process.env.MQSERVER_PORT_5672_TCP_PORT
});

var consumer = new AmqpConsumer(amqpUrl, process.env.COMMAND_QUEUE_NAME, new CommandsExecutor());
var publisher = new AmqpPublisher(amqpUrl, process.env.EVENT_QUEUE_NAME, new EventsPublisher());

//TODO: find a way to configure connection attempts
//by default in reconnect 2 times and do process.exit(0)
_.delay(consumer.connect.bind(consumer), 5000);
_.delay(publisher.connect.bind(publisher), 5000);
