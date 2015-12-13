(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var React = require('react');

var Application = require('../src/views/application.react');

React.render(React.createElement(Application, null), document.getElementById('entrypoint'));

},{"../src/views/application.react":17,"react":"react"}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
/**
 * @preserve jquery-param (c) 2015 KNOWLEDGECODE | MIT
 */
/*global define */
(function (global) {
    'use strict';

    var param = function (a) {
        var add = function (s, k, v) {
            v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
            s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
        }, buildParams = function (prefix, obj, s) {
            var i, len, key;

            if (Object.prototype.toString.call(obj) === '[object Array]') {
                for (i = 0, len = obj.length; i < len; i++) {
                    buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i], s);
                }
            } else if (obj && obj.toString() === '[object Object]') {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (prefix) {
                            buildParams(prefix + '[' + key + ']', obj[key], s, add);
                        } else {
                            buildParams(key, obj[key], s, add);
                        }
                    }
                }
            } else if (prefix) {
                add(s, prefix, obj);
            } else {
                for (key in obj) {
                    add(s, key, obj[key]);
                }
            }
            return s;
        };
        return buildParams('', a, []).join('&').replace(/%20/g, '+');
    };

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = param;
    } else if (typeof define === 'function' && define.amd) {
        define([], function () {
            return param;
        });
    } else {
        global.param = param;
    }

}(this));

},{}],5:[function(require,module,exports){
(function (process){
/*
 * PinkySwear.js 2.2.2 - Minimalistic implementation of the Promises/A+ spec
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 *
 * PinkySwear is a very small implementation of the Promises/A+ specification. After compilation with the
 * Google Closure Compiler and gzipping it weighs less than 500 bytes. It is based on the implementation for 
 * Minified.js and should be perfect for embedding. 
 *
 *
 * PinkySwear has just three functions.
 *
 * To create a new promise in pending state, call pinkySwear():
 *         var promise = pinkySwear();
 *
 * The returned object has a Promises/A+ compatible then() implementation:
 *          promise.then(function(value) { alert("Success!"); }, function(value) { alert("Failure!"); });
 *
 *
 * The promise returned by pinkySwear() is a function. To fulfill the promise, call the function with true as first argument and
 * an optional array of values to pass to the then() handler. By putting more than one value in the array, you can pass more than one
 * value to the then() handlers. Here an example to fulfill a promsise, this time with only one argument: 
 *         promise(true, [42]);
 *
 * When the promise has been rejected, call it with false. Again, there may be more than one argument for the then() handler:
 *         promise(true, [6, 6, 6]);
 *         
 * You can obtain the promise's current state by calling the function without arguments. It will be true if fulfilled,
 * false if rejected, and otherwise undefined.
 * 		   var state = promise(); 
 * 
 * https://github.com/timjansen/PinkySwear.js
 */
(function(target) {
	var undef;

	function isFunction(f) {
		return typeof f == 'function';
	}
	function isObject(f) {
		return typeof f == 'object';
	}
	function defer(callback) {
		if (typeof setImmediate != 'undefined')
			setImmediate(callback);
		else if (typeof process != 'undefined' && process['nextTick'])
			process['nextTick'](callback);
		else
			setTimeout(callback, 0);
	}

	target[0][target[1]] = function pinkySwear(extend) {
		var state;           // undefined/null = pending, true = fulfilled, false = rejected
		var values = [];     // an array of values as arguments for the then() handlers
		var deferred = [];   // functions to call when set() is invoked

		var set = function(newState, newValues) {
			if (state == null && newState != null) {
				state = newState;
				values = newValues;
				if (deferred.length)
					defer(function() {
						for (var i = 0; i < deferred.length; i++)
							deferred[i]();
					});
			}
			return state;
		};

		set['then'] = function (onFulfilled, onRejected) {
			var promise2 = pinkySwear(extend);
			var callCallbacks = function() {
	    		try {
	    			var f = (state ? onFulfilled : onRejected);
	    			if (isFunction(f)) {
		   				function resolve(x) {
						    var then, cbCalled = 0;
		   					try {
				   				if (x && (isObject(x) || isFunction(x)) && isFunction(then = x['then'])) {
										if (x === promise2)
											throw new TypeError();
										then['call'](x,
											function() { if (!cbCalled++) resolve.apply(undef,arguments); } ,
											function(value){ if (!cbCalled++) promise2(false,[value]);});
				   				}
				   				else
				   					promise2(true, arguments);
		   					}
		   					catch(e) {
		   						if (!cbCalled++)
		   							promise2(false, [e]);
		   					}
		   				}
		   				resolve(f.apply(undef, values || []));
		   			}
		   			else
		   				promise2(state, values);
				}
				catch (e) {
					promise2(false, [e]);
				}
			};
			if (state != null)
				defer(callCallbacks);
			else
				deferred.push(callCallbacks);
			return promise2;
		};
        if(extend){
            set = extend(set);
        }
		return set;
	};
})(typeof module == 'undefined' ? [window, 'pinkySwear'] : [module, 'exports']);


}).call(this,require('_process'))
},{"_process":2}],6:[function(require,module,exports){
/*! qwest 2.2.4 (https://github.com/pyrsmk/qwest) */

module.exports = function() {

	var global = window || this,
		pinkyswear = require('pinkyswear'),
		jparam = require('jquery-param'),
		// Default response type for XDR in auto mode
		defaultXdrResponseType = 'json',
		// Default data type
		defaultDataType = 'post',
		// Variables for limit mechanism
		limit = null,
		requests = 0,
		request_stack = [],
		// Get XMLHttpRequest object
		getXHR = function(){
			return global.XMLHttpRequest?
					new global.XMLHttpRequest():
					new ActiveXObject('Microsoft.XMLHTTP');
		},
		// Guess XHR version
		xhr2 = (getXHR().responseType===''),

	// Core function
	qwest = function(method, url, data, options, before) {

		// Format
		method = method.toUpperCase();
		data = data || null;
		options = options || {};

		// Define variables
		var nativeResponseParsing = false,
			crossOrigin,
			xhr,
			xdr = false,
			timeoutInterval,
			aborted = false,
			attempts = 0,
			headers = {},
			mimeTypes = {
				text: '*/*',
				xml: 'text/xml',
				json: 'application/json',
				post: 'application/x-www-form-urlencoded'
			},
			accept = {
				text: '*/*',
				xml: 'application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1',
				json: 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1'
			},
			vars = '',
			i, j,
			serialized,
			response,
			sending = false,
			delayed = false,
			timeout_start,

		// Create the promise
		promise = pinkyswear(function(pinky) {
			pinky['catch'] = function(f) {
				return pinky.then(null, f);
			};
			pinky.complete = function(f) {
				return pinky.then(f, f);
			};
			// Override
			if('pinkyswear' in options) {
				for(i in options.pinkyswear) {
					pinky[i] = options.pinkyswear[i];
				}
			}
			pinky.send = function() {
				// Prevent further send() calls
				if(sending) {
					return;
				}
				// Reached request limit, get out!
				if(requests == limit) {
					request_stack.push(pinky);
					return;
				}
				++requests;
				sending = true;
				// Start the chrono
				timeout_start = new Date().getTime();
				// Get XHR object
				xhr = getXHR();
				if(crossOrigin) {
					if(!('withCredentials' in xhr) && global.XDomainRequest) {
						xhr = new XDomainRequest(); // CORS with IE8/9
						xdr = true;
						if(method!='GET' && method!='POST') {
							method = 'POST';
						}
					}
				}
				// Open connection
				if(xdr) {
					xhr.open(method, url);
				}
				else {
					xhr.open(method, url, options.async, options.user, options.password);
					if(xhr2 && options.async) {
						xhr.withCredentials = options.withCredentials;
					}
				}
				// Set headers
				if(!xdr) {
					for(var i in headers) {
						if(headers[i]) {
							xhr.setRequestHeader(i, headers[i]);
						}
					}
				}
				// Verify if the response type is supported by the current browser
				if(xhr2 && options.responseType!='document' && options.responseType!='auto') { // Don't verify for 'document' since we're using an internal routine
					try {
						xhr.responseType = options.responseType;
						nativeResponseParsing = (xhr.responseType==options.responseType);
					}
					catch(e){}
				}
				// Plug response handler
				if(xhr2 || xdr) {
					xhr.onload = handleResponse;
					xhr.onerror = handleError;
				}
				else {
					xhr.onreadystatechange = function() {
						if(xhr.readyState == 4) {
							handleResponse();
						}
					};
				}
				// Override mime type to ensure the response is well parsed
				if(options.responseType!='auto' && 'overrideMimeType' in xhr) {
					xhr.overrideMimeType(mimeTypes[options.responseType]);
				}
				// Run 'before' callback
				if(before) {
					before(xhr);
				}
				// Send request
				if(xdr) {
					setTimeout(function(){ // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
						xhr.send(method!='GET'?data:null);
					},0);
				}
				else {
					xhr.send(method!='GET'?data:null);
				}
			};
			return pinky;
		}),

		// Handle the response
		handleResponse = function() {
			// Prepare
			var i, responseType;
			--requests;
			sending = false;
			// Verify timeout state
			// --- https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
			if(new Date().getTime()-timeout_start >= options.timeout) {
				if(!options.attempts || ++attempts!=options.attempts) {
					promise.send();
				}
				else {
					promise(false, [xhr,response,new Error('Timeout ('+url+')')]);
				}
				return;
			}
			// Launch next stacked request
			if(request_stack.length) {
				request_stack.shift().send();
			}
			// Handle response
			try{
				// Process response
				if(nativeResponseParsing && 'response' in xhr && xhr.response!==null) {
					response = xhr.response;
				}
				else if(options.responseType == 'document') {
					var frame = document.createElement('iframe');
					frame.style.display = 'none';
					document.body.appendChild(frame);
					frame.contentDocument.open();
					frame.contentDocument.write(xhr.response);
					frame.contentDocument.close();
					response = frame.contentDocument;
					document.body.removeChild(frame);
				}
				else{
					// Guess response type
					responseType = options.responseType;
					if(responseType == 'auto') {
						if(xdr) {
							responseType = defaultXdrResponseType;
						}
						else {
							var ct = xhr.getResponseHeader('Content-Type') || '';
							if(ct.indexOf(mimeTypes.json)>-1) {
								responseType = 'json';
							}
							else if(ct.indexOf(mimeTypes.xml)>-1) {
								responseType = 'xml';
							}
							else {
								responseType = 'text';
							}
						}
					}
					// Handle response type
					switch(responseType) {
						case 'json':
							try {
								if('JSON' in global) {
									response = JSON.parse(xhr.responseText);
								}
								else {
									response = eval('('+xhr.responseText+')');
								}
							}
							catch(e) {
								throw "Error while parsing JSON body : "+e;
							}
							break;
						case 'xml':
							// Based on jQuery's parseXML() function
							try {
								// Standard
								if(global.DOMParser) {
									response = (new DOMParser()).parseFromString(xhr.responseText,'text/xml');
								}
								// IE<9
								else {
									response = new ActiveXObject('Microsoft.XMLDOM');
									response.async = 'false';
									response.loadXML(xhr.responseText);
								}
							}
							catch(e) {
								response = undefined;
							}
							if(!response || !response.documentElement || response.getElementsByTagName('parsererror').length) {
								throw 'Invalid XML';
							}
							break;
						default:
							response = xhr.responseText;
					}
				}
				// Late status code verification to allow passing data when, per example, a 409 is returned
				// --- https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
				if('status' in xhr && !/^2|1223/.test(xhr.status)) {
					throw xhr.status+' ('+xhr.statusText+')';
				}
				// Fulfilled
				promise(true, [xhr,response]);
			}
			catch(e) {
				// Rejected
				promise(false, [xhr,response,e]);
			}
		},

		// Handle errors
		handleError = function(e) {
			--requests;
			promise(false, [xhr,null,new Error('Connection aborted')]);
		};

		// Normalize options
		options.async = 'async' in options?!!options.async:true;
		options.cache = 'cache' in options?!!options.cache:false;
		options.dataType = 'dataType' in options?options.dataType.toLowerCase():defaultDataType;
		options.responseType = 'responseType' in options?options.responseType.toLowerCase():'auto';
		options.user = options.user || '';
		options.password = options.password || '';
		options.withCredentials = !!options.withCredentials;
		options.timeout = 'timeout' in options?parseInt(options.timeout,10):30000;
		options.attempts = 'attempts' in options?parseInt(options.attempts,10):1;

		// Guess if we're dealing with a cross-origin request
		i = url.match(/\/\/(.+?)\//);
		crossOrigin = i && (i[1]?i[1]!=location.host:false);

		// Prepare data
		if('ArrayBuffer' in global && data instanceof ArrayBuffer) {
			options.dataType = 'arraybuffer';
		}
		else if('Blob' in global && data instanceof Blob) {
			options.dataType = 'blob';
		}
		else if('Document' in global && data instanceof Document) {
			options.dataType = 'document';
		}
		else if('FormData' in global && data instanceof FormData) {
			options.dataType = 'formdata';
		}
		switch(options.dataType) {
			case 'json':
				data = JSON.stringify(data);
				break;
			case 'post':
				data = jparam(data);
		}

		// Prepare headers
		if(options.headers) {
			var format = function(match,p1,p2) {
				return p1 + p2.toUpperCase();
			};
			for(i in options.headers) {
				headers[i.replace(/(^|-)([^-])/g,format)] = options.headers[i];
			}
		}
		if(!('Content-Type' in headers) && method!='GET') {
			if(options.dataType in mimeTypes) {
				if(mimeTypes[options.dataType]) {
					headers['Content-Type'] = mimeTypes[options.dataType];
				}
			}
		}
		if(!headers.Accept) {
			headers.Accept = (options.responseType in accept)?accept[options.responseType]:'*/*';
		}
		if(!crossOrigin && !('X-Requested-With' in headers)) { // (that header breaks in legacy browsers with CORS)
			headers['X-Requested-With'] = 'XMLHttpRequest';
		}
		if(!options.cache && !('Cache-Control' in headers)) {
			headers['Cache-Control'] = 'no-cache';
		}

		// Prepare URL
		if(method=='GET' && data) {
			vars += data;
		}
		if(vars) {
			url += (/\?/.test(url)?'&':'?')+vars;
		}

		// Start the request
		if(options.async) {
			promise.send();
		}

		// Return promise
		return promise;

	};

	// Return the external qwest object
	return {
		base: '',
		get: function(url, data, options, before) {
			return qwest('GET', this.base+url, data, options, before);
		},
		post: function(url, data, options, before) {
			return qwest('POST', this.base+url, data, options, before);
		},
		put: function(url, data, options, before) {
			return qwest('PUT', this.base+url, data, options, before);
		},
		'delete': function(url, data, options, before) {
			return qwest('DELETE', this.base+url, data, options, before);
		},
		map: function(type, url, data, options, before) {
			return qwest(type.toUpperCase(), this.base+url, data, options, before);
		},
		xhr2: xhr2,
		limit: function(by) {
			limit = by;
		},
		setDefaultXdrResponseType: function(type) {
			defaultXdrResponseType = type.toLowerCase();
		},
		setDefaultDataType: function(type) {
			defaultDataType = type.toLowerCase();
		}
	};

}();

},{"jquery-param":4,"pinkyswear":5}],7:[function(require,module,exports){
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

},{"../utils/Validation":16,"../webclients/ApiWebClient":18,"./Convention":9,"flux":"flux","lodash":"lodash"}],8:[function(require,module,exports){
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

},{"../stores/RouteStore":14,"../utils/Validation":16,"./Store":11,"classnames":3,"lodash":"lodash","react":"react"}],9:[function(require,module,exports){
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

},{"../utils/Validation":16}],10:[function(require,module,exports){
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

},{"../utils/Validation":16,"../webclients/ViewWebClient":19,"./Convention":9,"flux":"flux","lodash":"lodash"}],11:[function(require,module,exports){
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
        var path = _.initial(arguments);
        var value = _.last(arguments);

        if (path) {
            _.set(_state, path, value);
        } else {
            _state = value;
        }
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

},{"../utils/Validation":16,"events":"events","lodash":"lodash"}],12:[function(require,module,exports){
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

},{"./Command":7,"./Query":10,"./Store":11,"lodash":"lodash"}],13:[function(require,module,exports){
"use strict";

var _ = require("lodash");

var Symbols = [
    "AuthenticateUser",
    "CreateUser",

    "UserInfo",
    "UserExists"
];

module.exports = _.mapKeys(Symbols, _.indentity);

},{"lodash":"lodash"}],14:[function(require,module,exports){
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

},{"../core/StoreFactory":12,"../core/Symbols":13}],15:[function(require,module,exports){
"use strict";

var StoreFactory = require("../core/StoreFactory");
var Symbols = require("../core/Symbols");
var Convention = require("../core/Convention");

var UserExistsStore = StoreFactory.Create({
    getHandlers: function() {
        var _set = function(query) {
            this.set(query.response.data.username, query.response.data);
        };

        var _handlers = {};
        _handlers[Convention.Success(Symbols.UserExists)] = _set;

        return _handlers;
    }
});

module.exports = UserExistsStore;

},{"../core/Convention":9,"../core/StoreFactory":12,"../core/Symbols":13}],16:[function(require,module,exports){
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

},{"lodash":"lodash"}],17:[function(require,module,exports){
"use strict";

var _ = require("lodash");
var React = require("react");

var Command = require("../core/Command");
var Symbols = require("../core/Symbols");
var Query = require("../core/Query");
var Component = require("../core/Component");

var UserExistsStore = require("../stores/UserExistsStore");

var Application = Component.Create(UserExistsStore, {
    getState: function() {
        return {
            exists: UserExistsStore.get(_.get(this.state, 'username'))
        };
    },

    componentDidUpdate: function() {
        if (this.state.username && !UserExistsStore.has(this.state.username)) {
            Query(Symbols.UserExists, this.state.username);
        }
    },

    signIn: function() {
        var password = this.refs.password.getDOMNode().value;

        Command(Symbols.AuthenticateUser, this.state.username, password);
    },

    singUp: function() {
        var password = this.refs.password.getDOMNode().value;

        Command(Symbols.CreateUser, this.state.username, password);
    },

    _onUsernameChange: function(ev) {
        this.setState({ username: ev.target.value });
    },

    render: function() {
        return (React.createElement("div", null, 
            React.createElement("div", null, "exists: ", this.state.exists), 
            React.createElement("div", null, 
                "login: ", React.createElement("input", {id: "username", 
                    onChange: this._onUsernameChange, 
                    maxLength: "255", 
                    name: "username", 
                    type: "text"})
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

},{"../core/Command":7,"../core/Component":8,"../core/Query":10,"../core/Symbols":13,"../stores/UserExistsStore":15,"lodash":"lodash","react":"react"}],18:[function(require,module,exports){
"use strict";

var qwest = require('qwest');

var ApiWebClient = {
    AuthenticateUser: function(username, password) {
        return qwest.post('http://localhost:3000/api/auth/', {
            username: username,
            password: password
        }, {
            dataType: 'json'
        });
    },
    CreateUser: function(username, password) {
        return qwest.post('http://localhost:3000/api/users/create', {
            username: username,
            password: password
        }, {
            dataType: 'json'
        });
    }
};

module.exports = ApiWebClient;

},{"qwest":6}],19:[function(require,module,exports){
"use strict";

var _ = require("lodash");
var qwest = require("qwest");

var ViewWebClient = {
    UserExists: function(username) {
        return qwest.get(
            _.template("http://localhost:3001/api/user/exists/${username}")({username: username})
        );
    }
};

module.exports = ViewWebClient;

},{"lodash":"lodash","qwest":6}]},{},[1]);
