"use strict";

var _ = require("lodash");

var Dispatcher = require("flux").Dispatcher;
var _dispatcher = new Dispatcher();
var _dispatch = _dispatcher.dispatch;
_dispatcher.dispatch = function(command) {
    console.log(command);
    return _dispatch.apply(_dispatcher, arguments);
};

var ViewWebClient = require("../webclients/ViewWebClient");
var Validation = require("../utils/Validation");

var Convention = require("./Convention");

var _inprogress = {};
function Query(name) {
    Validation.IsTypeOf(name, 'string');
    var method = ViewWebClient[name];
    if(!_.isFunction(method)) return;

    var query = { name: name, args: _.rest(arguments) };
    var key = JSON.stringify(query);
    if(_.has(_inprogress, key)) return;
    _inprogress[key] = null;

    _dispatcher.dispatch(query);
    method.apply(ViewWebClient, query.args)
        .then(function(xhr, response) {
            _dispatcher.dispatch(_.extend({}, query, { name: Convention.Success(name), response: response }));
        })
        .catch(function(xhr, response, error) {
            _dispatcher.dispatch(_.extend({}, query, { name: Convention.Fails(name), response: response, error: error }));
        })
        .complete(function(xhr, response) {
            delete _inprogress[key];
        });
}

Query.register = function() {
    return _dispatcher.register.apply(_dispatcher, arguments);
};

module.exports = Query;
