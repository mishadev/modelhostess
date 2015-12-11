(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var React = require('react');

var Application = require('../src/views/application.react');

React.render(React.createElement(Application, null), document.getElementById('entrypoint'));

},{"../src/views/application.react":13,"react":"react"}],2:[function(require,module,exports){
/*!
  Copyright (c) 2015 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes += ' ' + arg;
			} else if (Array.isArray(arg)) {
				classes += ' ' + classNames.apply(null, arg);
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes += ' ' + key;
					}
				}
			}
		}

		return classes.substr(1);
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],3:[function(require,module,exports){
"use strict";

var _ = require("lodash");

var Dispatcher = require("flux").Dispatcher;
var _dispatcher = new Dispatcher();
var _dispatch = _dispatcher.dispatch;
_dispatcher.dispatch = function(command) {
    console.log(command);
    _dispatch.apply(_dispatcher, arguments);
};

var ApiWebClient = require("../webclients/ApiWebClient");
var Validation = require("../utils/Validation");

var Convention = require("./Convention");

function Command(name) {
    Validation.IsTypeOf(name, 'string');

    var query = { name: name, args: _.rest(arguments) };
    _dispatcher.dispatch(query);

    var method = ApiWebClient[name];
    if(!_.isFunction(method)) return;

    method.apply(ApiWebClient, query.args)
        .then(function(xhr, response) {
            _dispatcher.dispatch(_.extend({}, query, { name: Convention.Success(name), response: response }));
        })
        .catch(function(xhr, response, error) {
            _dispatcher.dispatch(_.extend({}, query, { name: Convention.Fails(name), response: response, error: error }));
        });
}

Command.register = function() {
    return _dispatcher.register.apply(_dispatcher, arguments);
};

Command.waitFor = function() {
    return _dispatcher.waitFor.apply(_dispatcher, arguments);
}

module.exports = Command;

},{"../utils/Validation":12,"../webclients/ApiWebClient":14,"./Convention":5,"flux":"flux","lodash":"lodash"}],4:[function(require,module,exports){
"use strict";

var _ = require("lodash");
var classnames = require("classnames");

var React = require("react");

var Store = require("./Store");

var RouteStore = require("../stores/RouteStore");

var Validation = require("../utils/Validation");

var _empty = _.partial(_.identity, undefined);

function Component(component, stores) {
    Validation.IsTypeOf(component, "object");
    var _component = component;

    Validation.IsArrayOfInstances(stores, Store);
    var _stores = stores;

    this.route = _.bind(RouteStore.get, RouteStore, "route");
    this.css = classnames;

    this._base = function(method, params) {
        return _.get(_component, method, _empty).apply(this, params);
    };

    if (!_.isEmpty(_stores)) {
        _stores = _.union(_stores, [RouteStore]);

        this.getInitialState = function() {
            return this._base("getInitialState") || this.getState();
        };

        this.componentDidMount = function() {
            this._base("componentDidMount");

            _.invoke(_stores, "on", this._onChange);

            this.componentDidUpdate();
        };

        this.componentWillUnmount = function() {
            this._base("componentWillUnmount");

            _.invoke(_stores, "off", this._onChange);
        };

        this.componentDidUpdate = function() {
            this._base("componentDidUpdate", _.toArray(arguments));
        };

        this.getState = function() {
            return this._base("getState", _.toArray(arguments));
        };

        this._onChange = function() {
            if(this.isMounted()) {
                this._base("_onChange");
                this.setState(this.getState());
            }
        };
    } else {
        this.shouldComponentUpdate = function(nextProp, nextState) {
            var result = this._base("shouldComponentUpdate", _.toArray(arguments));
            if (_.isBoolean(result)) return result;

            return !_.isEqual(nextProp, this.props) || !_.isEqual(nextState, this.state);
        };
    }

    //add if not exists;
    _.defaults(this, _component);
}

Component.Create = function() {
    var component = _.last(arguments),
        stores = _.initial(arguments);

    return React.createClass(new Component(component, stores));
}

module.exports = Component;

},{"../stores/RouteStore":10,"../utils/Validation":12,"./Store":7,"classnames":2,"lodash":"lodash","react":"react"}],5:[function(require,module,exports){
"use strict";

var Validation = require("../utils/Validation");

var Convention = {
    Fails: function(name) {
        Validation.IsTypeOf(name, 'string');
        return name + "Fails";
    },
    Success: function(name) {
        Validation.IsTypeOf(name, 'string');
        return name + "Success";
    }
}

module.exports = Convention;

},{"../utils/Validation":12}],6:[function(require,module,exports){
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

},{"../utils/Validation":12,"../webclients/ViewWebClient":15,"./Convention":5,"flux":"flux","lodash":"lodash"}],7:[function(require,module,exports){
"use strict";

var _ = require("lodash");

var EventEmitter = require("events").EventEmitter;

var Validation = require("../utils/Validation");

var CHANGE_EVENT = "change";

function Store(options) {
    if(_.has(options, 'getHandlers')) {
        Validation.IsTypeOf(options, 'function', ['getHandlers']);
    } else {
        Validation.IsTypeOf(options, 'function', ['globalHandler']);
    }
    _.extend(this, options);

    EventEmitter.call(this);
    this.setMaxListeners(100);

    var _state;

    var _emit = this.emit;
    this.emit = function() {
        _emit(CHANGE_EVENT);
    };

    var _on = this.on;
    this.on = function(callback) {
        _on(CHANGE_EVENT, callback);
    };

    this.off = function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    };

    this.get = function() {
        var path = _.toArray(arguments);
        return _.cloneDeep(path.length ? _.get(_state, path) : _state);
    };

    this.set = function(state) {
        _state = state;
    }

    this.has = function() {
        var path = _.toArray(arguments);
        return !_.isUndefined(path.length ? _.get(_state, path) : _state);
    };
}

Store.prototype = _.create(EventEmitter.prototype, {
    "constructor": Store
});

module.exports = Store;

},{"../utils/Validation":12,"events":"events","lodash":"lodash"}],8:[function(require,module,exports){
'use strict';

var _ = require('lodash');

var Store = require('./Store');
var Command = require('./Command');
var Query = require('./Query');

function StoreFactory() {
    var _register = function(dispatcher, store) {
        var handlers = store.getHandlers.call(store);

        return dispatcher.register(function(action) {
            if (_.isUndefined(action.name)) throw "invalid action was performed";

            var handler = handlers[action.name] || store.globalHandler;
            if (_.isFunction(handler)) {
                handler.call(store, action);
                store.emit();
            }
        });
    };

    this.Create = function(storeObject) {
        var store = new Store(storeObject);

        store.commandToken = _register(Command, store);
        store.queryToken = _register(Query, store);

        return store;
    }
}

module.exports = new StoreFactory();

},{"./Command":3,"./Query":6,"./Store":7,"lodash":"lodash"}],9:[function(require,module,exports){
"use strict";

var _ = require("lodash");

var Symbols = [
    "AuthenticateUser",
    "CreateUser",

    "UserInfo"
];

module.exports = _.mapKeys(Symbols, _.indentity);

},{"lodash":"lodash"}],10:[function(require,module,exports){
'use strict';

var StoreFactory = require('../core/StoreFactory');
var Symbols = require('../core/Symbols');

var RouteStore = StoreFactory.Create({
    getHandlers: function () {
        var _set = function(command) {
            this.set('route', command.route);
        };

        var handlers = {};
        handlers[Symbols.ChangeRoute] = _set;

        return handlers;
    }
});

module.exports = RouteStore;

},{"../core/StoreFactory":8,"../core/Symbols":9}],11:[function(require,module,exports){
"use strict";

var StoreFactory = require("../core/StoreFactory");
var Symbols = require("../core/Symbols");
var Convention = require("../core/Convention");

var UserInfoStore = StoreFactory.Create({
    getHandlers: function() {
        var _set = function(query) {
            this.set(query.response);
        };

        var _handlers = {};
        _handlers[Convention.Success(Symbols.UserInfo)] = _set;

        return _handlers;
    }
});

module.exports = UserInfoStore;

},{"../core/Convention":5,"../core/StoreFactory":8,"../core/Symbols":9}],12:[function(require,module,exports){
"use strict";

var _ = require("lodash");

function _exists(object, property) {
    if (!_.has(object, property)) {
        throw "Validation: '" + property + "' is not exists";
    }
}

function _getProperty(object, property) {
    if (_.isUndefined(property)) return object;

    _exists(object, property);
    return object[property];
}

function _inRange(value, range) {
    _exists(range, value);
}

function _isMatch(value, pattern) {
    var regexp = new RegExp(pattern);

    if(!regexp.test(value)) {
        throw "Validation: object or its property is not match";
    }
}

function _isVersion(value) {
    _isMatch(value, "^[0-9]+\.[0-9]+\.[0-9]+$");
}

function _isInstanceOf(value, type) {
    if(!(value instanceof type)) {
        throw "Validation: value is not an instance of expected type";
    }
}

function _isTypeOf(value, typeName) {
    if(_.isNaN(value) || typeof value !== typeName) {
        throw "Validation: value has wrong expected type";
    }
}

function _isTypeOfOrEmpty(value, typeName) {
    if(_.isEmpty(value)) return;

    _isTypeOf(value, typeName);
}

function _isArrayOfInstances(value, type) {
    if(!_.isArray(value)) {
        throw "Validation: array value is required to perform array of check";
    }
    _.each(value, _.curry(_isInstanceOf)(_, type));
}

function _isArrayOfType(value, typeName) {
    if(!_.isArray(value)) {
        throw "Validation: array value is required to perform array of check";
    }
    _.each(value, _.curry(_isTypeOf)(_, typeName));
}

function _isFunction(value) {
    if(!_.isFunction(value)) {
        throw "Validation: value is required to be a function";
    }
}

function _isNull(value) {
    if(!_.isNull(value)) {
        throw "Validation: value is required to be a null";
    }
}

function _create(validator) {
    return function() {
        var properties = _.last(arguments);

        if(_.isArray(properties)) {
            var target = _.first(arguments);
            var params = _.rest(_.initial(arguments));
            _.each(properties, function(property) {
                var value = _getProperty(target, property);

                validator.apply(validator, [value].concat(params));
            });
        } else {
            validator.apply(validator, arguments);
        }
    };
}

module.exports = {
    InRange: _create(_inRange),
    IsVersion: _create(_isVersion),
    IsMatch: _create(_isMatch),
    IsInstanceOf: _create(_isInstanceOf),
    IsFunction: _create(_isFunction),
    IsTypeOf: _create(_isTypeOf),
    IsTypeOfOrEmpty: _create(_isTypeOfOrEmpty),
    IsArrayOfInstances: _create(_isArrayOfInstances),
    IsArrayOfType: _create(_isArrayOfType),
    IsNull: _create(_isNull)
};

},{"lodash":"lodash"}],13:[function(require,module,exports){
"use strict";

var React = require("react");

var Command = require("../core/Command");
var Symbols = require("../core/Symbols");
var Query = require("../core/Query");
var Component = require("../core/Component");

var UserInfoStore = require("../stores/UserInfoStore");

var Application = Component.Create(UserInfoStore, {
    getState: function() {
        return {
            UserInfo: UserInfoStore.get()
        };
    },

    componentDidUpdate: function() {
        if (!UserInfoStore.has()) {
            Query(Symbols.UserInfo);
        }
    },

    signIn: function() {
        var username = this.refs.username.getDOMNode().value;
        var password = this.refs.password.getDOMNode().value;

        Command(Symbols.AuthenticateUser, username, password);
    },

    singUp: function() {
        var username = this.refs.username.getDOMNode().value;
        var password = this.refs.password.getDOMNode().value;

        Command(Symbols.CreateUser, username, password);
    },

    render: function() {
        return (React.createElement("div", null, 
            React.createElement("div", null, this.state.UserInfo), 
            React.createElement("div", null, 
                "login: ", React.createElement("input", {id: "username", ref: "username", maxLength: "255", name: "username", type: "text"})
            ), 
            React.createElement("div", null, 
                "password: ", React.createElement("input", {id: "password", ref: "password", name: "password", type: "password"})
            ), 
            React.createElement("div", null, 
                React.createElement("button", {onClick: this.signIn}, "Sign In")
            ), 
            React.createElement("div", null, 
                React.createElement("button", {onClick: this.singUp}, "Sing Up")
            )
        ));
    }
});

module.exports = Application;

},{"../core/Command":3,"../core/Component":4,"../core/Query":6,"../core/Symbols":9,"../stores/UserInfoStore":11,"react":"react"}],14:[function(require,module,exports){
"use strict";

var _ = require('lodash');
// var qwest = require('qwest');

var ApiWebClient = {
    AuthenticateUser: function(username, password) {
        console.log("AuthenticateUser");
        console.log(username);
        console.log(password);

        return {
            then: function(func) {
                _.defer(func);
                return this;
            },
            catch: function(func) {
                return this;
            }
        }
    },
    CreateUser: function(username, password) {
        console.log("CreateUser");
        console.log(username);
        console.log(password);

        return {
            then: function(func) {
                _.defer(func);
                return this;
            },
            catch: function(func) {
                return this;
            }
        }
    }
};

module.exports = ApiWebClient;

},{"lodash":"lodash"}],15:[function(require,module,exports){
"use strict";

var _ = require("lodash");

// var qwest = require('qwest');

var ViewWebClient = {
    UserInfo: function() {
        console.log("UserInfo");

        return {
            then: function(func) {
                _.defer(function() { func(null, {"username": "misha", "password": "misha"}); });
                return this;
            },
            catch: function(func) {
                return this;
            },
            complete: function(func) {
                _.defer(func);
            }
        }
    }
};

module.exports = ViewWebClient;

},{"lodash":"lodash"}]},{},[1]);
