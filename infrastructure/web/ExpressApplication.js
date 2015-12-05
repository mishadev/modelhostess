"use strict";

var util = require('util');

var _ = require('lodash');

var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var logger = require('morgan');

var Application = require('./Application');
var Route = require('./Route');
var Exceptions = require('./Exceptions');
var InvalidArgument = Exceptions.InvalidArgument;

var Validation = require('../utils/Validation');

function ExpressApplication(options) {
    Application.call(this)

    var _application = express();

    function _register(route) {
        Validation.IsInstanceOf(route, Route);

        var reg = _application[route.method];
        if(!_.isFunction(reg))
            throw new InvalidArgument('route');

        console.log('register route: method - ' + route.method + ' pattern: ' + route.pattern);
        reg.call(_application, route.pattern, route.handler);
    }

    function _registerRoutes(routes) {
        _.each(routes, _register);
    }

    function _registerDirectory(directory) {
        if(_.isString(directory) && !_.isEmpty(directory)) {
            console.log('register directory: ' + directory);
            _application.use(express.static(directory));
        }
    }

    _application.use(logger('dev'));
    _application.use(bodyParser.json());
    _application.use(bodyParser.urlencoded({ extended: false }));
    _application.use(compression());
    _registerDirectory(options.staticDirectory);
    _registerRoutes(options.routes);

    // catch 404 and forward to error handler
    _application.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    //error handler
    _application.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: _application.get('env') === 'development' ? err : {}
        });
    });

    this.instance = function() {
        return _application;
    }
}
util.inherits(ExpressApplication, Application);

module.exports = ExpressApplication;
