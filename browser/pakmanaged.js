var global = Function("return this;")()
/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011 (@ded @fat)
  * http://ender.no.de
  * License MIT
  */
!function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context.$

  function require (identifier) {
    // modules can be required from ender's build system, or found on the window
    var module = modules[identifier] || window[identifier]
    if (!module) throw new Error("Requested module '" + identifier + "' has not been defined.")
    return module
  }

  function provide (name, what) {
    return (modules[name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }

  function boosh(s, r, els) {
    // string || node || nodelist || window
    if (typeof s == 'string' || s.nodeName || (s.length && 'item' in s) || s == window) {
      els = ender._select(s, r)
      els.selector = s
    } else els = isFinite(s.length) ? s : [s]
    return aug(els, boosh)
  }

  function ender(s, r) {
    return boosh(s, r)
  }

  aug(ender, {
      _VERSION: '0.3.6'
    , fn: boosh // for easy compat to jQuery plugins
    , ender: function (o, chain) {
        aug(chain ? boosh : ender, o)
      }
    , _select: function (s, r) {
        return (r || document).querySelectorAll(s)
      }
  })

  aug(boosh, {
    forEach: function (fn, scope, i) {
      // opt out of native forEach so we can intentionally call our own scope
      // defaulting to the current item and be able to return self
      for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(scope || this[i], this[i], i, this)
      // return self for chaining
      return this
    },
    $: ender // handy reference to self
  })

  ender.noConflict = function () {
    context.$ = old
    return this
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = ender
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = context['ender'] || ender

}(this);
// ender:querystring as querystring
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  // Query String Utilities
  
  (typeof define === "undefined" ? function($) { $(require, exports, module) } : define)(function(require, exports, module, undefined) {
  "use strict";
  
  var QueryString = exports;
  
  function charCode(c) {
    return c.charCodeAt(0);
  }
  
  QueryString.unescape = decodeURIComponent;
  QueryString.escape = encodeURIComponent;
  
  var stringifyPrimitive = function(v) {
    switch (typeof v) {
      case 'string':
        return v;
  
      case 'boolean':
        return v ? 'true' : 'false';
  
      case 'number':
        return isFinite(v) ? v : '';
  
      default:
        return '';
    }
  };
  
  
  QueryString.stringify = QueryString.encode = function(obj, sep, eq, name) {
    sep = sep || '&';
    eq = eq || '=';
    obj = (obj === null) ? undefined : obj;
  
    switch (typeof obj) {
      case 'object':
        return Object.keys(obj).map(function(k) {
          if (Array.isArray(obj[k])) {
            return obj[k].map(function(v) {
              return QueryString.escape(stringifyPrimitive(k)) +
                     eq +
                     QueryString.escape(stringifyPrimitive(v));
            }).join(sep);
          } else {
            return QueryString.escape(stringifyPrimitive(k)) +
                   eq +
                   QueryString.escape(stringifyPrimitive(obj[k]));
          }
        }).join(sep);
  
      default:
        if (!name) return '';
        return QueryString.escape(stringifyPrimitive(name)) + eq +
               QueryString.escape(stringifyPrimitive(obj));
    }
  };
  
  // Parse a key=val string.
  QueryString.parse = QueryString.decode = function(qs, sep, eq) {
    sep = sep || '&';
    eq = eq || '=';
    var obj = {};
  
    if (typeof qs !== 'string' || qs.length === 0) {
      return obj;
    }
  
    qs.split(sep).forEach(function(kvp) {
      var x = kvp.split(eq);
      var k = QueryString.unescape(x[0], true);
      var v = QueryString.unescape(x.slice(1).join(eq), true);
  
      if (!(k in obj)) {
        obj[k] = v;
      } else if (!Array.isArray(obj[k])) {
        obj[k] = [obj[k], v];
      } else {
        obj[k].push(v);
      }
    });
  
    return obj;
  };
  
  });
  

  provide("querystring", module.exports);
  provide("querystring", module.exports);
  $.ender(module.exports);
}(global));

// ender:future as future
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  (function () {
    "use strict";
  
    var MAX_INT = Math.pow(2,52);
  
    function isFuture(obj) {
      return obj instanceof future;
    }
  
    function futureTimeout(time) {
      this.name = "FutureTimeout";
      this.message = "timeout " + time + "ms";
    }
  
  
  
    function future(global_context) {
      var everytimers = {},
        onetimers = {},
        index = 0,
        deliveries = 0,
        time = 0,
        fulfilled,
        data,
        timeout_id,
        //asap = false,
        asap =  true,
        passenger,
        self = this;
  
      // TODO change `null` to `this`
      global_context = ('undefined' === typeof global_context ? null : global_context);
  
  
      function resetTimeout() {
        if (timeout_id) {
          clearTimeout(timeout_id);
          timeout_id = undefined;
        }
  
        if (time > 0) {
          timeout_id = setTimeout(function () {
            self.deliver(new futureTimeout(time));
            timeout_id = undefined;
          }, time);
        }
      }
  
  
  
      self.isFuture = isFuture;
  
      self.setContext = function (context) {
        global_context = context;
      };
  
      self.setTimeout = function (new_time) {
        time = new_time;
        resetTimeout();
      };
  
  
  
      self.errback = function () {
        if (arguments.length < 2) {
          self.deliver.call(self, arguments[0] || new Error("`errback` called without Error"));
        } else {
          self.deliver.apply(self, arguments);
        }
      };
  
  
  
      self.callback = function () {
        var args = Array.prototype.slice.call(arguments);
  
        args.unshift(undefined);
        self.deliver.apply(self, args);
      };
  
  
  
      self.callbackCount = function() {
        return Object.keys(everytimers).length;
      };
  
  
  
      self.deliveryCount = function() {
        return deliveries;
      };
  
  
  
      self.setAsap = function(new_asap) {
        if (undefined === new_asap) {
          new_asap = true;
        }
        if (true !== new_asap && false !== new_asap) {
          throw new Error("Future.setAsap(asap) accepts literal true or false, not " + new_asap);
        }
        asap = new_asap;
      };
  
  
  
      // this will probably never get called and, hence, is not yet well tested
      function cleanup() {
        var new_everytimers = {},
          new_onetimers = {};
  
        index = 0;
        Object.keys(everytimers).forEach(function (id) {
          var newtimer = new_everytimers[index] = everytimers[id];
  
          if (onetimers[id]) {
            new_onetimers[index] = true;
          }
  
          newtimer.id = index;
          index += 1;
        });
  
        onetimers = new_onetimers;
        everytimers = new_everytimers;
      }
  
  
  
      function findCallback(callback, context) {
        var result;
        Object.keys(everytimers).forEach(function (id) {
          var everytimer = everytimers[id];
          if (callback === everytimer.callback) {
            if (context === everytimer.context || everytimer.context === global_context) {
              result = everytimer;
            }
          }
        });
        return result;
      }
  
  
  
      self.hasCallback = function () {
        return !!findCallback.apply(self, arguments);
      };
  
  
  
      self.removeCallback = function(callback, context) {
        var everytimer = findCallback(callback, context);
        if (everytimer) {
          delete everytimers[everytimer.id];
          onetimers[everytimer.id] = undefined;
          delete onetimers[everytimer.id];
        }
  
        return self;
      };
  
  
  
      self.deliver = function() {
        if (fulfilled) {
          throw new Error("`Future().fulfill(err, data, ...)` renders future deliveries useless");
        }
        var args = Array.prototype.slice.call(arguments);
        data = args;
  
        deliveries += 1; // Eventually reaches `Infinity`...
  
        Object.keys(everytimers).forEach(function (id) {
          var everytimer = everytimers[id],
            callback = everytimer.callback,
            context = everytimer.context;
  
          if (onetimers[id]) {
            delete everytimers[id];
            delete onetimers[id];
          }
  
          // TODO
          callback.apply(context, args);
          /*
          callback.apply(('undefined' !== context ? context : newme), args);
          context = newme;
          context = ('undefined' !== global_context ? global_context : context)
          context = ('undefined' !== local_context ? local_context : context)
          */
        });
  
        if (args[0] && "FutureTimeout" !== args[0].name) {
          resetTimeout();
        }
  
        return self;
      };
  
  
  
      self.fulfill = function () {
        if (arguments.length) {
          self.deliver.apply(self, arguments);
        } else {
          self.deliver();
        }
        fulfilled = true;
      };
  
  
  
      self.whenever = function (callback, local_context) {
        var id = index,
          everytimer;
  
        if ('function' !== typeof callback) {
          throw new Error("Future().whenever(callback, [context]): callback must be a function.");
        }
  
        if (findCallback(callback, local_context)) {
          // TODO log
          throw new Error("Future().everytimers is a strict set. Cannot add already subscribed `callback, [context]`.");
          return;
        }
  
        everytimer = everytimers[id] = {
          id: id,
          callback: callback,
          context: (null === local_context) ? null : (local_context || global_context)
        };
  
        if (asap && deliveries > 0) {
          // doesn't raise deliver count on purpose
          everytimer.callback.apply(everytimer.context, data);
          if (onetimers[id]) {
            delete onetimers[id];
            delete everytimers[id];
          }
        }
  
        index += 1;
        if (index >= MAX_INT) {
          cleanup(); // Works even for long-running processes
        }
  
        return self;
      };
  
  
  
      self.when = function (callback, local_context) {
        // this index will be the id of the everytimer
        onetimers[index] = true;
        self.whenever(callback, local_context);
  
        return self;
      };
  
  
      //
      function privatize(obj, pubs) {
        var result = {};
        pubs.forEach(function (pub) {
          result[pub] = function () {
            obj[pub].apply(obj, arguments);
            return result;
          };
        });
        return result;
      }
  
      passenger = privatize(self, [
        "when",
        "whenever"
      ]);
  
      self.passable = function () {
        return passenger;
      };
  
    }
  
    function Future(context) {
      // TODO use prototype instead of new
      return (new future(context));
    }
  
    Future.isFuture = isFuture;
    module.exports = Future;
  }());
  

  provide("future", module.exports);
  provide("future", module.exports);
  $.ender(module.exports);
}(global));

// ender:events.node as events
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  if ('undefined' === typeof process) {
    process = {};
  }
  (function () {
    "use strict";
  
    process.EventEmitter = process.EventEmitter || function () {};
  
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  var EventEmitter = exports.EventEmitter = process.EventEmitter;
  var isArray = Array.isArray;
  
  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  var defaultMaxListeners = 10;
  EventEmitter.prototype.setMaxListeners = function(n) {
    if (!this._events) this._events = {};
    this._events.maxListeners = n;
  };
  
  
  EventEmitter.prototype.emit = function(type) {
    // If there is no 'error' event listener then throw.
    if (type === 'error') {
      if (!this._events || !this._events.error ||
          (isArray(this._events.error) && !this._events.error.length))
      {
        if (arguments[1] instanceof Error) {
          throw arguments[1]; // Unhandled 'error' event
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }
  
    if (!this._events) return false;
    var handler = this._events[type];
    if (!handler) return false;
  
    if (typeof handler == 'function') {
      switch (arguments.length) {
        // fast cases
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        // slower
        default:
          var args = Array.prototype.slice.call(arguments, 1);
          handler.apply(this, args);
      }
      return true;
  
    } else if (isArray(handler)) {
      var args = Array.prototype.slice.call(arguments, 1);
  
      var listeners = handler.slice();
      for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i].apply(this, args);
      }
      return true;
  
    } else {
      return false;
    }
  };
  
  // EventEmitter is defined in src/node_events.cc
  // EventEmitter.prototype.emit() is also defined there.
  EventEmitter.prototype.addListener = function(type, listener) {
    if ('function' !== typeof listener) {
      throw new Error('addListener only takes instances of Function');
    }
  
    if (!this._events) this._events = {};
  
    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);
  
    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    } else if (isArray(this._events[type])) {
  
      // If we've already got an array, just append.
      this._events[type].push(listener);
  
      // Check for listener leak
      if (!this._events[type].warned) {
        var m;
        if (this._events.maxListeners !== undefined) {
          m = this._events.maxListeners;
        } else {
          m = defaultMaxListeners;
        }
  
        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error('(node) warning: possible EventEmitter memory ' +
                        'leak detected. %d listeners added. ' +
                        'Use emitter.setMaxListeners() to increase limit.',
                        this._events[type].length);
          console.trace();
        }
      }
    } else {
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];
    }
  
    return this;
  };
  
  EventEmitter.prototype.on = EventEmitter.prototype.addListener;
  
  EventEmitter.prototype.once = function(type, listener) {
    var self = this;
    function g() {
      self.removeListener(type, g);
      listener.apply(this, arguments);
    };
  
    g.listener = listener;
    self.on(type, g);
  
    return this;
  };
  
  EventEmitter.prototype.removeListener = function(type, listener) {
    if ('function' !== typeof listener) {
      throw new Error('removeListener only takes instances of Function');
    }
  
    // does not use listeners(), so no side effect of creating _events[type]
    if (!this._events || !this._events[type]) return this;
  
    var list = this._events[type];
  
    if (isArray(list)) {
      var position = -1;
      for (var i = 0, length = list.length; i < length; i++) {
        if (list[i] === listener ||
            (list[i].listener && list[i].listener === listener))
        {
          position = i;
          break;
        }
      }
  
      if (position < 0) return this;
      list.splice(position, 1);
      if (list.length == 0)
        delete this._events[type];
    } else if (list === listener ||
               (list.listener && list.listener === listener))
    {
      delete this._events[type];
    }
  
    return this;
  };
  
  EventEmitter.prototype.removeAllListeners = function(type) {
    // does not use listeners(), so no side effect of creating _events[type]
    if (type && this._events && this._events[type]) this._events[type] = null;
    return this;
  };
  
  EventEmitter.prototype.listeners = function(type) {
    if (!this._events) this._events = {};
    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };
  
  }());
  

  provide("events.node", module.exports);
  provide("events", module.exports);
  $.ender(module.exports);
}(global));

// ender:url as url
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  (function () {
    "use strict";
  
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  exports.parse = urlParse;
  exports.resolve = urlResolve;
  exports.resolveObject = urlResolveObject;
  exports.format = urlFormat;
  
  // Reference: RFC 3986, RFC 1808, RFC 2396
  
  // define these here so at least they only have to be
  // compiled once on the first module load.
  var protocolPattern = /^([a-z0-9]+:)/i,
      portPattern = /:[0-9]+$/,
      // RFC 2396: characters reserved for delimiting URLs.
      delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
      // RFC 2396: characters not allowed for various reasons.
      unwise = ['{', '}', '|', '\\', '^', '~', '[', ']', '`'].concat(delims),
      // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
      autoEscape = ['\''],
      // Characters that are never ever allowed in a hostname.
      // Note that any invalid chars are also handled, but these
      // are the ones that are *expected* to be seen, so we fast-path
      // them.
      nonHostChars = ['%', '/', '?', ';', '#']
        .concat(unwise).concat(autoEscape),
      nonAuthChars = ['/', '@', '?', '#'].concat(delims),
      hostnameMaxLen = 255,
      hostnamePartPattern = /^[a-zA-Z0-9][a-z0-9A-Z-]{0,62}$/,
      hostnamePartStart = /^([a-zA-Z0-9][a-z0-9A-Z-]{0,62})(.*)$/,
      // protocols that can allow "unsafe" and "unwise" chars.
      unsafeProtocol = {
        'javascript': true,
        'javascript:': true
      },
      // protocols that never have a hostname.
      hostlessProtocol = {
        'javascript': true,
        'javascript:': true
      },
      // protocols that always have a path component.
      pathedProtocol = {
        'http': true,
        'https': true,
        'ftp': true,
        'gopher': true,
        'file': true,
        'http:': true,
        'ftp:': true,
        'gopher:': true,
        'file:': true
      },
      // protocols that always contain a // bit.
      slashedProtocol = {
        'http': true,
        'https': true,
        'ftp': true,
        'gopher': true,
        'file': true,
        'http:': true,
        'https:': true,
        'ftp:': true,
        'gopher:': true,
        'file:': true
      },
      querystring = require('querystring');
  
  function urlParse(url, parseQueryString, slashesDenoteHost) {
    if (url && typeof(url) === 'object' && url.href) return url;
  
    var out = {},
        rest = url;
  
    // cut off any delimiters.
    // This is to support parse stuff like "<http://foo.com>"
    for (var i = 0, l = rest.length; i < l; i++) {
      if (delims.indexOf(rest.charAt(i)) === -1) break;
    }
    if (i !== 0) rest = rest.substr(i);
  
  
    var proto = protocolPattern.exec(rest);
    if (proto) {
      proto = proto[0];
      var lowerProto = proto.toLowerCase();
      out.protocol = lowerProto;
      rest = rest.substr(proto.length);
    }
  
    // figure out if it's got a host
    // user@server is *always* interpreted as a hostname, and url
    // resolution will treat //foo/bar as host=foo,path=bar because that's
    // how the browser resolves relative URLs.
    if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
      var slashes = rest.substr(0, 2) === '//';
      if (slashes && !(proto && hostlessProtocol[proto])) {
        rest = rest.substr(2);
        out.slashes = true;
      }
    }
  
    if (!hostlessProtocol[proto] &&
        (slashes || (proto && !slashedProtocol[proto]))) {
      // there's a hostname.
      // the first instance of /, ?, ;, or # ends the host.
      // don't enforce full RFC correctness, just be unstupid about it.
  
      // If there is an @ in the hostname, then non-host chars *are* allowed
      // to the left of the first @ sign, unless some non-auth character
      // comes *before* the @-sign.
      // URLs are obnoxious.
      var atSign = rest.indexOf('@');
      if (atSign !== -1) {
        // there *may be* an auth
        var hasAuth = true;
        for (var i = 0, l = nonAuthChars.length; i < l; i++) {
          var index = rest.indexOf(nonAuthChars[i]);
          if (index !== -1 && index < atSign) {
            // not a valid auth.  Something like http://foo.com/bar@baz/
            hasAuth = false;
            break;
          }
        }
        if (hasAuth) {
          // pluck off the auth portion.
          out.auth = rest.substr(0, atSign);
          rest = rest.substr(atSign + 1);
        }
      }
  
      var firstNonHost = -1;
      for (var i = 0, l = nonHostChars.length; i < l; i++) {
        var index = rest.indexOf(nonHostChars[i]);
        if (index !== -1 &&
            (firstNonHost < 0 || index < firstNonHost)) firstNonHost = index;
      }
  
      if (firstNonHost !== -1) {
        out.host = rest.substr(0, firstNonHost);
        rest = rest.substr(firstNonHost);
      } else {
        out.host = rest;
        rest = '';
      }
  
      // pull out port.
      var p = parseHost(out.host);
      if (out.auth) out.host = out.auth + '@' + out.host;
      var keys = Object.keys(p);
      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        out[key] = p[key];
      }
  
      // we've indicated that there is a hostname,
      // so even if it's empty, it has to be present.
      out.hostname = out.hostname || '';
  
      // validate a little.
      if (out.hostname.length > hostnameMaxLen) {
        out.hostname = '';
      } else {
        var hostparts = out.hostname.split(/\./);
        for (var i = 0, l = hostparts.length; i < l; i++) {
          var part = hostparts[i];
          if (!part) continue;
          if (!part.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest
            }
            out.hostname = validParts.join('.');
            break;
          }
        }
      }
      // hostnames are always lower case.
      out.hostname = out.hostname.toLowerCase();
  
      out.host = ((out.auth) ? out.auth + '@' : '') +
          (out.hostname || '') +
          ((out.port) ? ':' + out.port : '');
      out.href += out.host;
    }
  
    // now rest is set to the post-host stuff.
    // chop off any delim chars.
    if (!unsafeProtocol[lowerProto]) {
  
      // First, make 100% sure that any "autoEscape" chars get
      // escaped, even if encodeURIComponent doesn't think they
      // need to be.
      for (var i = 0, l = autoEscape.length; i < l; i++) {
        var ae = autoEscape[i];
        var esc = encodeURIComponent(ae);
        if (esc === ae) {
          esc = escape(ae);
        }
        rest = rest.split(ae).join(esc);
      }
  
      // Now make sure that delims never appear in a url.
      var chop = rest.length;
      for (var i = 0, l = delims.length; i < l; i++) {
        var c = rest.indexOf(delims[i]);
        if (c !== -1) {
          chop = Math.min(c, chop);
        }
      }
      rest = rest.substr(0, chop);
    }
  
  
    // chop off from the tail first.
    var hash = rest.indexOf('#');
    if (hash !== -1) {
      // got a fragment string.
      out.hash = rest.substr(hash);
      rest = rest.slice(0, hash);
    }
    var qm = rest.indexOf('?');
    if (qm !== -1) {
      out.search = rest.substr(qm);
      out.query = rest.substr(qm + 1);
      if (parseQueryString) {
        out.query = querystring.parse(out.query);
      }
      rest = rest.slice(0, qm);
    } else if (parseQueryString) {
      // no query string, but parseQueryString still requested
      out.search = '';
      out.query = {};
    }
    if (rest) out.pathname = rest;
    if (slashedProtocol[proto] &&
        out.hostname && !out.pathname) {
      out.pathname = '/';
    }
  
    // finally, reconstruct the href based on what has been validated.
    out.href = urlFormat(out);
  
    return out;
  }
  
  // format a parsed object into a url string
  function urlFormat(obj) {
    // ensure it's an object, and not a string url.
    // If it's an obj, this is a no-op.
    // this way, you can call url_format() on strings
    // to clean up potentially wonky urls.
    if (typeof(obj) === 'string') obj = urlParse(obj);
  
    var auth = obj.auth;
    if (auth) {
      auth = auth.split('@').join('%40');
      for (var i = 0, l = nonAuthChars.length; i < l; i++) {
        var nAC = nonAuthChars[i];
        auth = auth.split(nAC).join(encodeURIComponent(nAC));
      }
    }
  
    var protocol = obj.protocol || '',
        host = (obj.host !== undefined) ? obj.host :
            obj.hostname !== undefined ? (
                (auth ? auth + '@' : '') +
                obj.hostname +
                (obj.port ? ':' + obj.port : '')
            ) :
            false,
        pathname = obj.pathname || '',
        query = obj.query &&
                ((typeof obj.query === 'object' &&
                  Object.keys(obj.query).length) ?
                   querystring.stringify(obj.query) :
                   '') || '',
        search = obj.search || (query && ('?' + query)) || '',
        hash = obj.hash || '';
  
    if (protocol && protocol.substr(-1) !== ':') protocol += ':';
  
    // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
    // unless they had them to begin with.
    if (obj.slashes ||
        (!protocol || slashedProtocol[protocol]) && host !== false) {
      host = '//' + (host || '');
      if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
    } else if (!host) {
      host = '';
    }
  
    if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
    if (search && search.charAt(0) !== '?') search = '?' + search;
  
    return protocol + host + pathname + search + hash;
  }
  
  function urlResolve(source, relative) {
    return urlFormat(urlResolveObject(source, relative));
  }
  
  function urlResolveObject(source, relative) {
    if (!source) return relative;
  
    source = urlParse(urlFormat(source), false, true);
    relative = urlParse(urlFormat(relative), false, true);
  
    // hash is always overridden, no matter what.
    source.hash = relative.hash;
  
    if (relative.href === '') return source;
  
    // hrefs like //foo/bar always cut to the protocol.
    if (relative.slashes && !relative.protocol) {
      relative.protocol = source.protocol;
      return relative;
    }
  
    if (relative.protocol && relative.protocol !== source.protocol) {
      // if it's a known url protocol, then changing
      // the protocol does weird things
      // first, if it's not file:, then we MUST have a host,
      // and if there was a path
      // to begin with, then we MUST have a path.
      // if it is file:, then the host is dropped,
      // because that's known to be hostless.
      // anything else is assumed to be absolute.
  
      if (!slashedProtocol[relative.protocol]) return relative;
  
      source.protocol = relative.protocol;
      if (!relative.host && !hostlessProtocol[relative.protocol]) {
        var relPath = (relative.pathname || '').split('/');
        while (relPath.length && !(relative.host = relPath.shift()));
        if (!relative.host) relative.host = '';
        if (relPath[0] !== '') relPath.unshift('');
        if (relPath.length < 2) relPath.unshift('');
        relative.pathname = relPath.join('/');
      }
      source.pathname = relative.pathname;
      source.search = relative.search;
      source.query = relative.query;
      source.host = relative.host || '';
      delete source.auth;
      delete source.hostname;
      source.port = relative.port;
      return source;
    }
  
    var isSourceAbs = (source.pathname && source.pathname.charAt(0) === '/'),
        isRelAbs = (
            relative.host !== undefined ||
            relative.pathname && relative.pathname.charAt(0) === '/'
        ),
        mustEndAbs = (isRelAbs || isSourceAbs ||
                      (source.host && relative.pathname)),
        removeAllDots = mustEndAbs,
        srcPath = source.pathname && source.pathname.split('/') || [],
        relPath = relative.pathname && relative.pathname.split('/') || [],
        psychotic = source.protocol &&
            !slashedProtocol[source.protocol] &&
            source.host !== undefined;
  
    // if the url is a non-slashed url, then relative
    // links like ../.. should be able
    // to crawl up to the hostname, as well.  This is strange.
    // source.protocol has already been set by now.
    // Later on, put the first path part into the host field.
    if (psychotic) {
  
      delete source.hostname;
      delete source.auth;
      delete source.port;
      if (source.host) {
        if (srcPath[0] === '') srcPath[0] = source.host;
        else srcPath.unshift(source.host);
      }
      delete source.host;
  
      if (relative.protocol) {
        delete relative.hostname;
        delete relative.auth;
        delete relative.port;
        if (relative.host) {
          if (relPath[0] === '') relPath[0] = relative.host;
          else relPath.unshift(relative.host);
        }
        delete relative.host;
      }
      mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
    }
  
    if (isRelAbs) {
      // it's absolute.
      source.host = (relative.host || relative.host === '') ?
                        relative.host : source.host;
      source.search = relative.search;
      source.query = relative.query;
      srcPath = relPath;
      // fall through to the dot-handling below.
    } else if (relPath.length) {
      // it's relative
      // throw away the existing file, and take the new path instead.
      if (!srcPath) srcPath = [];
      srcPath.pop();
      srcPath = srcPath.concat(relPath);
      source.search = relative.search;
      source.query = relative.query;
    } else if ('search' in relative) {
      // just pull out the search.
      // like href='?foo'.
      // Put this after the other two cases because it simplifies the booleans
      if (psychotic) {
        source.host = srcPath.shift();
      }
      source.search = relative.search;
      source.query = relative.query;
      return source;
    }
    if (!srcPath.length) {
      // no path at all.  easy.
      // we've already handled the other stuff above.
      delete source.pathname;
      return source;
    }
  
    // if a url ENDs in . or .., then it must get a trailing slash.
    // however, if it ends in anything else non-slashy,
    // then it must NOT get a trailing slash.
    var last = srcPath.slice(-1)[0];
    var hasTrailingSlash = (
        (source.host || relative.host) && (last === '.' || last === '..') ||
        last === '');
  
    // strip single dots, resolve double dots to parent dir
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = srcPath.length; i >= 0; i--) {
      last = srcPath[i];
      if (last == '.') {
        srcPath.splice(i, 1);
      } else if (last === '..') {
        srcPath.splice(i, 1);
        up++;
      } else if (up) {
        srcPath.splice(i, 1);
        up--;
      }
    }
  
    // if the path is allowed to go above the root, restore leading ..s
    if (!mustEndAbs && !removeAllDots) {
      for (; up--; up) {
        srcPath.unshift('..');
      }
    }
  
    if (mustEndAbs && srcPath[0] !== '' &&
        (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
      srcPath.unshift('');
    }
  
    if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
      srcPath.push('');
    }
  
    var isAbsolute = srcPath[0] === '' ||
        (srcPath[0] && srcPath[0].charAt(0) === '/');
  
    // put the host back
    if (psychotic) {
      source.host = isAbsolute ? '' : srcPath.shift();
    }
  
    mustEndAbs = mustEndAbs || (source.host && srcPath.length);
  
    if (mustEndAbs && !isAbsolute) {
      srcPath.unshift('');
    }
  
    source.pathname = srcPath.join('/');
  
  
    return source;
  }
  
  function parseHost(host) {
    var out = {};
    var port = portPattern.exec(host);
    if (port) {
      port = port[0];
      out.port = port.substr(1);
      host = host.substr(0, host.length - port.length);
    }
    if (host) out.hostname = host;
    return out;
  }
  
  }());
  

  provide("url", module.exports);
  provide("url", module.exports);
  $.ender(module.exports);
}(global));

// ender:join as join
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  (function () {
    "use strict";
  
    var Future = require('future');
  
    function isJoin(obj) {
      return obj instanceof join;
    }
  
    function join(global_context) {
      var self = this,
        data = [],
        ready = [],
        subs = [],
        promise_only = false,
        begun = false,
        updated = 0,
        join_future = Future(global_context);
  
      global_context = global_context || null;
  
      function relay() {
        var i;
        if (!begun || updated !== data.length) {
          return;
        }
        updated = 0;
        join_future.deliver.apply(join_future, data);
        data = Array(data.length);
        ready = Array(ready.length);
        //for (i = 0; i < data.length; i += 1) {
        //  data[i] = undefined;
        //}
      }
  
      function init() {
        var type = (promise_only ? "when" : "whenever");
  
        begun = true;
        data = Array(subs.length);
        ready = Array(subs.length);
  
        subs.forEach(function (sub, id) {
          sub[type](function () {
            var args = Array.prototype.slice.call(arguments);
            data[id] = args;
            if (!ready[id]) {
              ready[id] = true;
              updated += 1;
            }
            relay();
          });
        });
      }
  
      self.deliverer = function () {
        var future = Future();
        self.add(future);
        return future.deliver;
      };
      self.newCallback = self.deliverer;
  
      self.when = function () {
        if (!begun) {
          init();
        }
        join_future.when.apply(join_future, arguments);
      };
  
      self.whenever = function () {
        if (!begun) {
          init();
        }
        join_future.whenever.apply(join_future, arguments);
      };
  
      self.add = function () {
        if (begun) {
          throw new Error("`Join().add(Array<future> | subs1, [subs2, ...])` requires that all additions be completed before the first `when()` or `whenever()`");
        }
        var args = Array.prototype.slice.call(arguments);
        if (0 === args.length) {
          return self.newCallback();
        }
        args = Array.isArray(args[0]) ? args[0] : args;
        args.forEach(function (sub) {
          if (!sub.whenever) {
            promise_only = true;
          }
          if (!sub.when) {
            throw new Error("`Join().add(future)` requires either a promise or future");
          }
          subs.push(sub);
        });
      };
    }
  
    function Join(context) {
      // TODO use prototype instead of new
      return (new join(context));
    }
    Join.isJoin = isJoin;
    module.exports = Join;
  }());
  

  provide("join", module.exports);
  provide("join", module.exports);
  $.ender(module.exports);
}(global));

// ender:sax as sax
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  // wrapper for non-node envs
  ;(function (sax) {
  
  sax.parser = function (strict, opt) { return new SAXParser(strict, opt) }
  sax.SAXParser = SAXParser
  sax.SAXStream = SAXStream
  sax.createStream = createStream
  
  // When we pass the MAX_BUFFER_LENGTH position, start checking for buffer overruns.
  // When we check, schedule the next check for MAX_BUFFER_LENGTH - (max(buffer lengths)),
  // since that's the earliest that a buffer overrun could occur.  This way, checks are
  // as rare as required, but as often as necessary to ensure never crossing this bound.
  // Furthermore, buffers are only tested at most once per write(), so passing a very
  // large string into write() might have undesirable effects, but this is manageable by
  // the caller, so it is assumed to be safe.  Thus, a call to write() may, in the extreme
  // edge case, result in creating at most one complete copy of the string passed in.
  // Set to Infinity to have unlimited buffers.
  sax.MAX_BUFFER_LENGTH = 64 * 1024
  
  var buffers = [
    "comment", "sgmlDecl", "textNode", "tagName", "doctype",
    "procInstName", "procInstBody", "entity", "attribName",
    "attribValue", "cdata", "script"
  ]
  
  sax.EVENTS = // for discoverability.
    [ "text"
    , "processinginstruction"
    , "sgmldeclaration"
    , "doctype"
    , "comment"
    , "attribute"
    , "opentag"
    , "closetag"
    , "opencdata"
    , "cdata"
    , "closecdata"
    , "error"
    , "end"
    , "ready"
    , "script"
    , "opennamespace"
    , "closenamespace"
    ]
  
  function SAXParser (strict, opt) {
    if (!(this instanceof SAXParser)) return new SAXParser(strict, opt)
  
    var parser = this
    clearBuffers(parser)
    parser.q = parser.c = ""
    parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH
    parser.opt = opt || {}
    parser.tagCase = parser.opt.lowercasetags ? "toLowerCase" : "toUpperCase"
    parser.tags = []
    parser.closed = parser.closedRoot = parser.sawRoot = false
    parser.tag = parser.error = null
    parser.strict = !!strict
    parser.noscript = !!(strict || parser.opt.noscript)
    parser.state = S.BEGIN
    parser.ENTITIES = Object.create(sax.ENTITIES)
    parser.attribList = []
  
    // namespaces form a prototype chain.
    // it always points at the current tag,
    // which protos to its parent tag.
    if (parser.opt.xmlns) parser.ns = Object.create(rootNS)
  
    // mostly just for error reporting
    parser.position = parser.line = parser.column = 0
    emit(parser, "onready")
  }
  
  if (!Object.create) Object.create = function (o) {
    function f () { this.__proto__ = o }
    f.prototype = o
    return new f
  }
  
  if (!Object.getPrototypeOf) Object.getPrototypeOf = function (o) {
    return o.__proto__
  }
  
  if (!Object.keys) Object.keys = function (o) {
    var a = []
    for (var i in o) if (o.hasOwnProperty(i)) a.push(i)
    return a
  }
  
  function checkBufferLength (parser) {
    var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10)
      , maxActual = 0
    for (var i = 0, l = buffers.length; i < l; i ++) {
      var len = parser[buffers[i]].length
      if (len > maxAllowed) {
        // Text/cdata nodes can get big, and since they're buffered,
        // we can get here under normal conditions.
        // Avoid issues by emitting the text node now,
        // so at least it won't get any bigger.
        switch (buffers[i]) {
          case "textNode":
            closeText(parser)
          break
  
          case "cdata":
            emitNode(parser, "oncdata", parser.cdata)
            parser.cdata = ""
          break
  
          case "script":
            emitNode(parser, "onscript", parser.script)
            parser.script = ""
          break
  
          default:
            error(parser, "Max buffer length exceeded: "+buffers[i])
        }
      }
      maxActual = Math.max(maxActual, len)
    }
    // schedule the next check for the earliest possible buffer overrun.
    parser.bufferCheckPosition = (sax.MAX_BUFFER_LENGTH - maxActual)
                               + parser.position
  }
  
  function clearBuffers (parser) {
    for (var i = 0, l = buffers.length; i < l; i ++) {
      parser[buffers[i]] = ""
    }
  }
  
  SAXParser.prototype =
    { end: function () { end(this) }
    , write: write
    , resume: function () { this.error = null; return this }
    , close: function () { return this.write(null) }
    , end: function () { return this.write(null) }
    }
  
  try {
    var Stream = require("stream").Stream
  } catch (ex) {
    var Stream = function () {}
  }
  
  
  var streamWraps = sax.EVENTS.filter(function (ev) {
    return ev !== "error" && ev !== "end"
  })
  
  function createStream (strict, opt) {
    return new SAXStream(strict, opt)
  }
  
  function SAXStream (strict, opt) {
    if (!(this instanceof SAXStream)) return new SAXStream(strict, opt)
  
    Stream.apply(me)
  
    this._parser = new SAXParser(strict, opt)
    this.writable = true
    this.readable = true
  
  
    var me = this
  
    this._parser.onend = function () {
      me.emit("end")
    }
  
    this._parser.onerror = function (er) {
      me.emit("error", er)
  
      // if didn't throw, then means error was handled.
      // go ahead and clear error, so we can write again.
      me._parser.error = null
    }
  
    streamWraps.forEach(function (ev) {
      Object.defineProperty(me, "on" + ev, {
        get: function () { return me._parser["on" + ev] },
        set: function (h) {
          if (!h) {
            me.removeAllListeners(ev)
            return me._parser["on"+ev] = h
          }
          me.on(ev, h)
        },
        enumerable: true,
        configurable: false
      })
    })
  }
  
  SAXStream.prototype = Object.create(Stream.prototype,
    { constructor: { value: SAXStream } })
  
  SAXStream.prototype.write = function (data) {
    this._parser.write(data.toString())
    this.emit("data", data)
    return true
  }
  
  SAXStream.prototype.end = function (chunk) {
    if (chunk && chunk.length) this._parser.write(chunk.toString())
    this._parser.end()
    return true
  }
  
  SAXStream.prototype.on = function (ev, handler) {
    var me = this
    if (!me._parser["on"+ev] && streamWraps.indexOf(ev) !== -1) {
      me._parser["on"+ev] = function () {
        var args = arguments.length === 1 ? [arguments[0]]
                 : Array.apply(null, arguments)
        args.splice(0, 0, ev)
        me.emit.apply(me, args)
      }
    }
  
    return Stream.prototype.on.call(me, ev, handler)
  }
  
  
  
  // character classes and tokens
  var whitespace = "\r\n\t "
    // this really needs to be replaced with character classes.
    // XML allows all manner of ridiculous numbers and digits.
    , number = "0124356789"
    , letter = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    // (Letter | "_" | ":")
    , nameStart = letter+"_:"
    , nameBody = nameStart+number+"-."
    , quote = "'\""
    , entity = number+letter+"#"
    , attribEnd = whitespace + ">"
    , CDATA = "[CDATA["
    , DOCTYPE = "DOCTYPE"
    , XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace"
    , XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/"
    , rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE }
  
  // turn all the string character sets into character class objects.
  whitespace = charClass(whitespace)
  number = charClass(number)
  letter = charClass(letter)
  nameStart = charClass(nameStart)
  nameBody = charClass(nameBody)
  quote = charClass(quote)
  entity = charClass(entity)
  attribEnd = charClass(attribEnd)
  
  function charClass (str) {
    return str.split("").reduce(function (s, c) {
      s[c] = true
      return s
    }, {})
  }
  
  function is (charclass, c) {
    return charclass[c]
  }
  
  function not (charclass, c) {
    return !charclass[c]
  }
  
  var S = 0
  sax.STATE =
  { BEGIN                     : S++
  , TEXT                      : S++ // general stuff
  , TEXT_ENTITY               : S++ // &amp and such.
  , OPEN_WAKA                 : S++ // <
  , SGML_DECL                 : S++ // <!BLARG
  , SGML_DECL_QUOTED          : S++ // <!BLARG foo "bar
  , DOCTYPE                   : S++ // <!DOCTYPE
  , DOCTYPE_QUOTED            : S++ // <!DOCTYPE "//blah
  , DOCTYPE_DTD               : S++ // <!DOCTYPE "//blah" [ ...
  , DOCTYPE_DTD_QUOTED        : S++ // <!DOCTYPE "//blah" [ "foo
  , COMMENT_STARTING          : S++ // <!-
  , COMMENT                   : S++ // <!--
  , COMMENT_ENDING            : S++ // <!-- blah -
  , COMMENT_ENDED             : S++ // <!-- blah --
  , CDATA                     : S++ // <![CDATA[ something
  , CDATA_ENDING              : S++ // ]
  , CDATA_ENDING_2            : S++ // ]]
  , PROC_INST                 : S++ // <?hi
  , PROC_INST_BODY            : S++ // <?hi there
  , PROC_INST_QUOTED          : S++ // <?hi "there
  , PROC_INST_ENDING          : S++ // <?hi "there" ?
  , OPEN_TAG                  : S++ // <strong
  , OPEN_TAG_SLASH            : S++ // <strong /
  , ATTRIB                    : S++ // <a
  , ATTRIB_NAME               : S++ // <a foo
  , ATTRIB_NAME_SAW_WHITE     : S++ // <a foo _
  , ATTRIB_VALUE              : S++ // <a foo=
  , ATTRIB_VALUE_QUOTED       : S++ // <a foo="bar
  , ATTRIB_VALUE_UNQUOTED     : S++ // <a foo=bar
  , ATTRIB_VALUE_ENTITY_Q     : S++ // <foo bar="&quot;"
  , ATTRIB_VALUE_ENTITY_U     : S++ // <foo bar=&quot;
  , CLOSE_TAG                 : S++ // </a
  , CLOSE_TAG_SAW_WHITE       : S++ // </a   >
  , SCRIPT                    : S++ // <script> ...
  , SCRIPT_ENDING             : S++ // <script> ... <
  }
  
  sax.ENTITIES =
  { "apos" : "'"
  , "quot" : "\""
  , "amp"  : "&"
  , "gt"   : ">"
  , "lt"   : "<"
  }
  
  for (var S in sax.STATE) sax.STATE[sax.STATE[S]] = S
  
  // shorthand
  S = sax.STATE
  
  function emit (parser, event, data) {
    parser[event] && parser[event](data)
  }
  
  function emitNode (parser, nodeType, data) {
    if (parser.textNode) closeText(parser)
    emit(parser, nodeType, data)
  }
  
  function closeText (parser) {
    parser.textNode = textopts(parser.opt, parser.textNode)
    if (parser.textNode) emit(parser, "ontext", parser.textNode)
    parser.textNode = ""
  }
  
  function textopts (opt, text) {
    if (opt.trim) text = text.trim()
    if (opt.normalize) text = text.replace(/\s+/g, " ")
    return text
  }
  
  function error (parser, er) {
    closeText(parser)
    er += "\nLine: "+parser.line+
          "\nColumn: "+parser.column+
          "\nChar: "+parser.c
    er = new Error(er)
    parser.error = er
    emit(parser, "onerror", er)
    return parser
  }
  
  function end (parser) {
    if (parser.state !== S.TEXT) error(parser, "Unexpected end")
    closeText(parser)
    parser.c = ""
    parser.closed = true
    emit(parser, "onend")
    SAXParser.call(parser, parser.strict, parser.opt)
    return parser
  }
  
  function strictFail (parser, message) {
    if (parser.strict) error(parser, message)
  }
  
  function newTag (parser) {
    if (!parser.strict) parser.tagName = parser.tagName[parser.tagCase]()
    var parent = parser.tags[parser.tags.length - 1] || parser
      , tag = parser.tag = { name : parser.tagName, attributes : {} }
  
    // will be overridden if tag contails an xmlns="foo" or xmlns:foo="bar"
    if (parser.opt.xmlns) tag.ns = parent.ns
    parser.attribList.length = 0
  }
  
  function qname (name) {
    var i = name.indexOf(":")
      , qualName = i < 0 ? [ "", name ] : name.split(":")
      , prefix = qualName[0]
      , local = qualName[1]
  
    // <x "xmlns"="http://foo">
    if (name === "xmlns") {
      prefix = "xmlns"
      local = ""
    }
  
    return { prefix: prefix, local: local }
  }
  
  function attrib (parser) {
    if (parser.opt.xmlns) {
      var qn = qname(parser.attribName)
        , prefix = qn.prefix
        , local = qn.local
  
      if (prefix === "xmlns") {
        // namespace binding attribute; push the binding into scope
        if (local === "xml" && parser.attribValue !== XML_NAMESPACE) {
          strictFail( parser
                    , "xml: prefix must be bound to " + XML_NAMESPACE + "\n"
                    + "Actual: " + parser.attribValue )
        } else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) {
          strictFail( parser
                    , "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\n"
                    + "Actual: " + parser.attribValue )
        } else {
          var tag = parser.tag
            , parent = parser.tags[parser.tags.length - 1] || parser
          if (tag.ns === parent.ns) {
            tag.ns = Object.create(parent.ns)
          }
          tag.ns[local] = parser.attribValue
        }
      }
  
      // defer onattribute events until all attributes have been seen
      // so any new bindings can take effect; preserve attribute order
      // so deferred events can be emitted in document order
      parser.attribList.push([parser.attribName, parser.attribValue])
    } else {
      // in non-xmlns mode, we can emit the event right away
      parser.tag.attributes[parser.attribName] = parser.attribValue
      emitNode( parser
              , "onattribute"
              , { name: parser.attribName
                , value: parser.attribValue } )
    }
  
    parser.attribName = parser.attribValue = ""
  }
  
  function openTag (parser, selfClosing) {
    if (parser.opt.xmlns) {
      // emit namespace binding events
      var tag = parser.tag
  
      // add namespace info to tag
      var qn = qname(parser.tagName)
      tag.prefix = qn.prefix
      tag.local = qn.local
      tag.uri = tag.ns[qn.prefix] || qn.prefix
  
      if (tag.prefix && !tag.uri) {
        strictFail(parser, "Unbound namespace prefix: "
                         + JSON.stringify(parser.tagName))
      }
  
      var parent = parser.tags[parser.tags.length - 1] || parser
      if (tag.ns && parent.ns !== tag.ns) {
        Object.keys(tag.ns).forEach(function (p) {
          emitNode( parser
                  , "onopennamespace"
                  , { prefix: p , uri: tag.ns[p] } )
        })
      }
  
      // handle deferred onattribute events
      for (var i = 0, l = parser.attribList.length; i < l; i ++) {
        var nv = parser.attribList[i]
        var name = nv[0]
          , value = nv[1]
          , qualName = qname(name)
          , prefix = qualName.prefix
          , local = qualName.local
          , uri = tag.ns[prefix] || ""
          , a = { name: name
                , value: value
                , prefix: prefix
                , local: local
                , uri: uri
                }
  
        // if there's any attributes with an undefined namespace,
        // then fail on them now.
        if (prefix && prefix != "xmlns" && !uri) {
          strictFail(parser, "Unbound namespace prefix: "
                           + JSON.stringify(prefix))
          a.uri = prefix
        }
        parser.tag.attributes[name] = a
        emitNode(parser, "onattribute", a)
      }
      parser.attribList.length = 0
    }
  
    // process the tag
    parser.sawRoot = true
    parser.tags.push(parser.tag)
    emitNode(parser, "onopentag", parser.tag)
    if (!selfClosing) {
      // special case for <script> in non-strict mode.
      if (!parser.noscript && parser.tagName.toLowerCase() === "script") {
        parser.state = S.SCRIPT
      } else {
        parser.state = S.TEXT
      }
      parser.tag = null
      parser.tagName = ""
    }
    parser.attribName = parser.attribValue = ""
    parser.attribList.length = 0
  }
  
  function closeTag (parser) {
    if (!parser.tagName) {
      strictFail(parser, "Weird empty close tag.")
      parser.textNode += "</>"
      parser.state = S.TEXT
      return
    }
    // first make sure that the closing tag actually exists.
    // <a><b></c></b></a> will close everything, otherwise.
    var t = parser.tags.length
    var tagName = parser.tagName
    if (!parser.strict) tagName = tagName[parser.tagCase]()
    var closeTo = tagName
    while (t --) {
      var close = parser.tags[t]
      if (close.name !== closeTo) {
        // fail the first time in strict mode
        strictFail(parser, "Unexpected close tag")
      } else break
    }
  
    // didn't find it.  we already failed for strict, so just abort.
    if (t < 0) {
      strictFail(parser, "Unmatched closing tag: "+parser.tagName)
      parser.textNode += "</" + parser.tagName + ">"
      parser.state = S.TEXT
      return
    }
    parser.tagName = tagName
    var s = parser.tags.length
    while (s --> t) {
      var tag = parser.tag = parser.tags.pop()
      parser.tagName = parser.tag.name
      emitNode(parser, "onclosetag", parser.tagName)
  
      var x = {}
      for (var i in tag.ns) x[i] = tag.ns[i]
  
      var parent = parser.tags[parser.tags.length - 1] || parser
      if (parser.opt.xmlns && tag.ns !== parent.ns) {
        // remove namespace bindings introduced by tag
        Object.keys(tag.ns).forEach(function (p) {
          var n = tag.ns[p]
          emitNode(parser, "onclosenamespace", { prefix: p, uri: n })
        })
      }
    }
    if (t === 0) parser.closedRoot = true
    parser.tagName = parser.attribValue = parser.attribName = ""
    parser.attribList.length = 0
    parser.state = S.TEXT
  }
  
  function parseEntity (parser) {
    var entity = parser.entity.toLowerCase()
      , num
      , numStr = ""
    if (parser.ENTITIES[entity]) return parser.ENTITIES[entity]
    if (entity.charAt(0) === "#") {
      if (entity.charAt(1) === "x") {
        entity = entity.slice(2)
        num = parseInt(entity, 16)
        numStr = num.toString(16)
      } else {
        entity = entity.slice(1)
        num = parseInt(entity, 10)
        numStr = num.toString(10)
      }
    }
    entity = entity.replace(/^0+/, "")
    if (numStr.toLowerCase() !== entity) {
      strictFail(parser, "Invalid character entity")
      return "&"+parser.entity + ";"
    }
    return String.fromCharCode(num)
  }
  
  function write (chunk) {
    var parser = this
    if (this.error) throw this.error
    if (parser.closed) return error(parser,
      "Cannot write after close. Assign an onready handler.")
    if (chunk === null) return end(parser)
    var i = 0, c = ""
    while (parser.c = c = chunk.charAt(i++)) {
      parser.position ++
      if (c === "\n") {
        parser.line ++
        parser.column = 0
      } else parser.column ++
      switch (parser.state) {
  
        case S.BEGIN:
          if (c === "<") parser.state = S.OPEN_WAKA
          else if (not(whitespace,c)) {
            // have to process this as a text node.
            // weird, but happens.
            strictFail(parser, "Non-whitespace before first tag.")
            parser.textNode = c
            parser.state = S.TEXT
          }
        continue
  
        case S.TEXT:
          if (parser.sawRoot && !parser.closedRoot) {
            var starti = i-1
            while (c && c!=="<" && c!=="&") {
              c = chunk.charAt(i++)
              if (c) {
                parser.position ++
                if (c === "\n") {
                  parser.line ++
                  parser.column = 0
                } else parser.column ++
              }
            }
            parser.textNode += chunk.substring(starti, i-1)
          }
          if (c === "<") parser.state = S.OPEN_WAKA
          else {
            if (not(whitespace, c) && (!parser.sawRoot || parser.closedRoot))
              strictFail("Text data outside of root node.")
            if (c === "&") parser.state = S.TEXT_ENTITY
            else parser.textNode += c
          }
        continue
  
        case S.SCRIPT:
          // only non-strict
          if (c === "<") {
            parser.state = S.SCRIPT_ENDING
          } else parser.script += c
        continue
  
        case S.SCRIPT_ENDING:
          if (c === "/") {
            emitNode(parser, "onscript", parser.script)
            parser.state = S.CLOSE_TAG
            parser.script = ""
            parser.tagName = ""
          } else {
            parser.script += "<" + c
            parser.state = S.SCRIPT
          }
        continue
  
        case S.OPEN_WAKA:
          // either a /, ?, !, or text is coming next.
          if (c === "!") {
            parser.state = S.SGML_DECL
            parser.sgmlDecl = ""
          } else if (is(whitespace, c)) {
            // wait for it...
          } else if (is(nameStart,c)) {
            parser.startTagPosition = parser.position - 1
            parser.state = S.OPEN_TAG
            parser.tagName = c
          } else if (c === "/") {
            parser.startTagPosition = parser.position - 1
            parser.state = S.CLOSE_TAG
            parser.tagName = ""
          } else if (c === "?") {
            parser.state = S.PROC_INST
            parser.procInstName = parser.procInstBody = ""
          } else {
            strictFail(parser, "Unencoded <")
            parser.textNode += "<" + c
            parser.state = S.TEXT
          }
        continue
  
        case S.SGML_DECL:
          if ((parser.sgmlDecl+c).toUpperCase() === CDATA) {
            emitNode(parser, "onopencdata")
            parser.state = S.CDATA
            parser.sgmlDecl = ""
            parser.cdata = ""
          } else if (parser.sgmlDecl+c === "--") {
            parser.state = S.COMMENT
            parser.comment = ""
            parser.sgmlDecl = ""
          } else if ((parser.sgmlDecl+c).toUpperCase() === DOCTYPE) {
            parser.state = S.DOCTYPE
            if (parser.doctype || parser.sawRoot) strictFail(parser,
              "Inappropriately located doctype declaration")
            parser.doctype = ""
            parser.sgmlDecl = ""
          } else if (c === ">") {
            emitNode(parser, "onsgmldeclaration", parser.sgmlDecl)
            parser.sgmlDecl = ""
            parser.state = S.TEXT
          } else if (is(quote, c)) {
            parser.state = S.SGML_DECL_QUOTED
            parser.sgmlDecl += c
          } else parser.sgmlDecl += c
        continue
  
        case S.SGML_DECL_QUOTED:
          if (c === parser.q) {
            parser.state = S.SGML_DECL
            parser.q = ""
          }
          parser.sgmlDecl += c
        continue
  
        case S.DOCTYPE:
          if (c === ">") {
            parser.state = S.TEXT
            emitNode(parser, "ondoctype", parser.doctype)
            parser.doctype = true // just remember that we saw it.
          } else {
            parser.doctype += c
            if (c === "[") parser.state = S.DOCTYPE_DTD
            else if (is(quote, c)) {
              parser.state = S.DOCTYPE_QUOTED
              parser.q = c
            }
          }
        continue
  
        case S.DOCTYPE_QUOTED:
          parser.doctype += c
          if (c === parser.q) {
            parser.q = ""
            parser.state = S.DOCTYPE
          }
        continue
  
        case S.DOCTYPE_DTD:
          parser.doctype += c
          if (c === "]") parser.state = S.DOCTYPE
          else if (is(quote,c)) {
            parser.state = S.DOCTYPE_DTD_QUOTED
            parser.q = c
          }
        continue
  
        case S.DOCTYPE_DTD_QUOTED:
          parser.doctype += c
          if (c === parser.q) {
            parser.state = S.DOCTYPE_DTD
            parser.q = ""
          }
        continue
  
        case S.COMMENT:
          if (c === "-") parser.state = S.COMMENT_ENDING
          else parser.comment += c
        continue
  
        case S.COMMENT_ENDING:
          if (c === "-") {
            parser.state = S.COMMENT_ENDED
            parser.comment = textopts(parser.opt, parser.comment)
            if (parser.comment) emitNode(parser, "oncomment", parser.comment)
            parser.comment = ""
          } else {
            parser.comment += "-" + c
            parser.state = S.COMMENT
          }
        continue
  
        case S.COMMENT_ENDED:
          if (c !== ">") {
            strictFail(parser, "Malformed comment")
            // allow <!-- blah -- bloo --> in non-strict mode,
            // which is a comment of " blah -- bloo "
            parser.comment += "--" + c
            parser.state = S.COMMENT
          } else parser.state = S.TEXT
        continue
  
        case S.CDATA:
          if (c === "]") parser.state = S.CDATA_ENDING
          else parser.cdata += c
        continue
  
        case S.CDATA_ENDING:
          if (c === "]") parser.state = S.CDATA_ENDING_2
          else {
            parser.cdata += "]" + c
            parser.state = S.CDATA
          }
        continue
  
        case S.CDATA_ENDING_2:
          if (c === ">") {
            if (parser.cdata) emitNode(parser, "oncdata", parser.cdata)
            emitNode(parser, "onclosecdata")
            parser.cdata = ""
            parser.state = S.TEXT
          } else if (c === "]") {
            parser.cdata += "]"
          } else {
            parser.cdata += "]]" + c
            parser.state = S.CDATA
          }
        continue
  
        case S.PROC_INST:
          if (c === "?") parser.state = S.PROC_INST_ENDING
          else if (is(whitespace, c)) parser.state = S.PROC_INST_BODY
          else parser.procInstName += c
        continue
  
        case S.PROC_INST_BODY:
          if (!parser.procInstBody && is(whitespace, c)) continue
          else if (c === "?") parser.state = S.PROC_INST_ENDING
          else if (is(quote, c)) {
            parser.state = S.PROC_INST_QUOTED
            parser.q = c
            parser.procInstBody += c
          } else parser.procInstBody += c
        continue
  
        case S.PROC_INST_ENDING:
          if (c === ">") {
            emitNode(parser, "onprocessinginstruction", {
              name : parser.procInstName,
              body : parser.procInstBody
            })
            parser.procInstName = parser.procInstBody = ""
            parser.state = S.TEXT
          } else {
            parser.procInstBody += "?" + c
            parser.state = S.PROC_INST_BODY
          }
        continue
  
        case S.PROC_INST_QUOTED:
          parser.procInstBody += c
          if (c === parser.q) {
            parser.state = S.PROC_INST_BODY
            parser.q = ""
          }
        continue
  
        case S.OPEN_TAG:
          if (is(nameBody, c)) parser.tagName += c
          else {
            newTag(parser)
            if (c === ">") openTag(parser)
            else if (c === "/") parser.state = S.OPEN_TAG_SLASH
            else {
              if (not(whitespace, c)) strictFail(
                parser, "Invalid character in tag name")
              parser.state = S.ATTRIB
            }
          }
        continue
  
        case S.OPEN_TAG_SLASH:
          if (c === ">") {
            openTag(parser, true)
            closeTag(parser)
          } else {
            strictFail(parser, "Forward-slash in opening tag not followed by >")
            parser.state = S.ATTRIB
          }
        continue
  
        case S.ATTRIB:
          // haven't read the attribute name yet.
          if (is(whitespace, c)) continue
          else if (c === ">") openTag(parser)
          else if (c === "/") parser.state = S.OPEN_TAG_SLASH
          else if (is(nameStart, c)) {
            parser.attribName = c
            parser.attribValue = ""
            parser.state = S.ATTRIB_NAME
          } else strictFail(parser, "Invalid attribute name")
        continue
  
        case S.ATTRIB_NAME:
          if (c === "=") parser.state = S.ATTRIB_VALUE
          else if (is(whitespace, c)) parser.state = S.ATTRIB_NAME_SAW_WHITE
          else if (is(nameBody, c)) parser.attribName += c
          else strictFail(parser, "Invalid attribute name")
        continue
  
        case S.ATTRIB_NAME_SAW_WHITE:
          if (c === "=") parser.state = S.ATTRIB_VALUE
          else if (is(whitespace, c)) continue
          else {
            strictFail(parser, "Attribute without value")
            parser.tag.attributes[parser.attribName] = ""
            parser.attribValue = ""
            emitNode(parser, "onattribute",
                     { name : parser.attribName, value : "" })
            parser.attribName = ""
            if (c === ">") openTag(parser)
            else if (is(nameStart, c)) {
              parser.attribName = c
              parser.state = S.ATTRIB_NAME
            } else {
              strictFail(parser, "Invalid attribute name")
              parser.state = S.ATTRIB
            }
          }
        continue
  
        case S.ATTRIB_VALUE:
          if (is(whitespace, c)) continue
          else if (is(quote, c)) {
            parser.q = c
            parser.state = S.ATTRIB_VALUE_QUOTED
          } else {
            strictFail(parser, "Unquoted attribute value")
            parser.state = S.ATTRIB_VALUE_UNQUOTED
            parser.attribValue = c
          }
        continue
  
        case S.ATTRIB_VALUE_QUOTED:
          if (c !== parser.q) {
            if (c === "&") parser.state = S.ATTRIB_VALUE_ENTITY_Q
            else parser.attribValue += c
            continue
          }
          attrib(parser)
          parser.q = ""
          parser.state = S.ATTRIB
        continue
  
        case S.ATTRIB_VALUE_UNQUOTED:
          if (not(attribEnd,c)) {
            if (c === "&") parser.state = S.ATTRIB_VALUE_ENTITY_U
            else parser.attribValue += c
            continue
          }
          attrib(parser)
          if (c === ">") openTag(parser)
          else parser.state = S.ATTRIB
        continue
  
        case S.CLOSE_TAG:
          if (!parser.tagName) {
            if (is(whitespace, c)) continue
            else if (not(nameStart, c)) strictFail(parser,
              "Invalid tagname in closing tag.")
            else parser.tagName = c
          }
          else if (c === ">") closeTag(parser)
          else if (is(nameBody, c)) parser.tagName += c
          else {
            if (not(whitespace, c)) strictFail(parser,
              "Invalid tagname in closing tag")
            parser.state = S.CLOSE_TAG_SAW_WHITE
          }
        continue
  
        case S.CLOSE_TAG_SAW_WHITE:
          if (is(whitespace, c)) continue
          if (c === ">") closeTag(parser)
          else strictFail("Invalid characters in closing tag")
        continue
  
        case S.TEXT_ENTITY:
        case S.ATTRIB_VALUE_ENTITY_Q:
        case S.ATTRIB_VALUE_ENTITY_U:
          switch(parser.state) {
            case S.TEXT_ENTITY:
              var returnState = S.TEXT, buffer = "textNode"
            break
  
            case S.ATTRIB_VALUE_ENTITY_Q:
              var returnState = S.ATTRIB_VALUE_QUOTED, buffer = "attribValue"
            break
  
            case S.ATTRIB_VALUE_ENTITY_U:
              var returnState = S.ATTRIB_VALUE_UNQUOTED, buffer = "attribValue"
            break
          }
          if (c === ";") {
            parser[buffer] += parseEntity(parser)
            parser.entity = ""
            parser.state = returnState
          }
          else if (is(entity, c)) parser.entity += c
          else {
            strictFail("Invalid character entity")
            parser[buffer] += "&" + parser.entity + c
            parser.entity = ""
            parser.state = returnState
          }
        continue
  
        default:
          throw new Error(parser, "Unknown state: " + parser.state)
      }
    } // while
    // cdata blocks can get very big under normal conditions. emit and move on.
    // if (parser.state === S.CDATA && parser.cdata) {
    //   emitNode(parser, "oncdata", parser.cdata)
    //   parser.cdata = ""
    // }
    if (parser.position >= parser.bufferCheckPosition) checkBufferLength(parser)
    return parser
  }
  
  })(typeof exports === "undefined" ? sax = {} : exports)
  

  provide("sax", module.exports);
  provide("sax", module.exports);
  $.ender(module.exports);
}(global));

// ender:xmlbuilder/lXMLFragment as xmlbuilder/lXMLFragment
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  (function() {
    var XMLFragment;
    var __hasProp = Object.prototype.hasOwnProperty;
    XMLFragment = (function() {
      function XMLFragment(parent, name, attributes, text) {
        this.isDoc = false;
        this.isRoot = false;
        this.parent = parent;
        this.name = name;
        this.attributes = attributes;
        this.value = text;
        this.children = [];
      }
      XMLFragment.prototype.element = function(name, attributes, text) {
        var child, key, val, _ref, _ref2;
        if (!(name != null)) {
          throw new Error("Missing element name");
        }
        name = '' + name || '';
        this.assertLegalChar(name);
              if (attributes != null) {
          attributes;
        } else {
          attributes = {};
        };
        if (this.is(attributes, 'String') && this.is(text, 'Object')) {
          _ref = [text, attributes], attributes = _ref[0], text = _ref[1];
        } else if (this.is(attributes, 'String')) {
          _ref2 = [{}, attributes], attributes = _ref2[0], text = _ref2[1];
        }
        for (key in attributes) {
          if (!__hasProp.call(attributes, key)) continue;
          val = attributes[key];
          val = '' + val || '';
          attributes[key] = this.escape(val);
        }
        child = new XMLFragment(this, name, attributes);
        if (text != null) {
          text = '' + text || '';
          text = this.escape(text);
          this.assertLegalChar(text);
          child.text(text);
        }
        this.children.push(child);
        return child;
      };
      XMLFragment.prototype.insertBefore = function(name, attributes, text) {
        var child, i, key, val, _ref, _ref2;
        if (this.isRoot || this.isDoc) {
          throw new Error("Cannot insert elements at root level");
        }
        if (!(name != null)) {
          throw new Error("Missing element name");
        }
        name = '' + name || '';
        this.assertLegalChar(name);
              if (attributes != null) {
          attributes;
        } else {
          attributes = {};
        };
        if (this.is(attributes, 'String') && this.is(text, 'Object')) {
          _ref = [text, attributes], attributes = _ref[0], text = _ref[1];
        } else if (this.is(attributes, 'String')) {
          _ref2 = [{}, attributes], attributes = _ref2[0], text = _ref2[1];
        }
        for (key in attributes) {
          if (!__hasProp.call(attributes, key)) continue;
          val = attributes[key];
          val = '' + val || '';
          attributes[key] = this.escape(val);
        }
        child = new XMLFragment(this.parent, name, attributes);
        if (text != null) {
          text = '' + text || '';
          text = this.escape(text);
          this.assertLegalChar(text);
          child.text(text);
        }
        i = this.parent.children.indexOf(this);
        this.parent.children.splice(i, 0, child);
        return child;
      };
      XMLFragment.prototype.insertAfter = function(name, attributes, text) {
        var child, i, key, val, _ref, _ref2;
        if (this.isRoot || this.isDoc) {
          throw new Error("Cannot insert elements at root level");
        }
        if (!(name != null)) {
          throw new Error("Missing element name");
        }
        name = '' + name || '';
        this.assertLegalChar(name);
              if (attributes != null) {
          attributes;
        } else {
          attributes = {};
        };
        if (this.is(attributes, 'String') && this.is(text, 'Object')) {
          _ref = [text, attributes], attributes = _ref[0], text = _ref[1];
        } else if (this.is(attributes, 'String')) {
          _ref2 = [{}, attributes], attributes = _ref2[0], text = _ref2[1];
        }
        for (key in attributes) {
          if (!__hasProp.call(attributes, key)) continue;
          val = attributes[key];
          val = '' + val || '';
          attributes[key] = this.escape(val);
        }
        child = new XMLFragment(this.parent, name, attributes);
        if (text != null) {
          text = '' + text || '';
          text = this.escape(text);
          this.assertLegalChar(text);
          child.text(text);
        }
        i = this.parent.children.indexOf(this);
        this.parent.children.splice(i + 1, 0, child);
        return child;
      };
      XMLFragment.prototype.remove = function() {
        var i, _ref;
        if (this.isRoot || this.isDoc) {
          throw new Error("Cannot remove the root element");
        }
        i = this.parent.children.indexOf(this);
        [].splice.apply(this.parent.children, [i, i - i + 1].concat(_ref = [])), _ref;
        return this.parent;
      };
      XMLFragment.prototype.text = function(value) {
        var child;
        if (!(value != null)) {
          throw new Error("Missing element text");
        }
        value = '' + value || '';
        value = this.escape(value);
        this.assertLegalChar(value);
        child = new XMLFragment(this, '', {}, value);
        this.children.push(child);
        return this;
      };
      XMLFragment.prototype.cdata = function(value) {
        var child;
        if (!(value != null)) {
          throw new Error("Missing CDATA text");
        }
        value = '' + value || '';
        this.assertLegalChar(value);
        if (value.match(/]]>/)) {
          throw new Error("Invalid CDATA text: " + value);
        }
        child = new XMLFragment(this, '', {}, '<![CDATA[' + value + ']]>');
        this.children.push(child);
        return this;
      };
      XMLFragment.prototype.comment = function(value) {
        var child;
        if (!(value != null)) {
          throw new Error("Missing comment text");
        }
        value = '' + value || '';
        value = this.escape(value);
        this.assertLegalChar(value);
        if (value.match(/--/)) {
          throw new Error("Comment text cannot contain double-hypen: " + value);
        }
        child = new XMLFragment(this, '', {}, '<!-- ' + value + ' -->');
        this.children.push(child);
        return this;
      };
      XMLFragment.prototype.raw = function(value) {
        var child;
        if (!(value != null)) {
          throw new Error("Missing raw text");
        }
        value = '' + value || '';
        child = new XMLFragment(this, '', {}, value);
        this.children.push(child);
        return this;
      };
      XMLFragment.prototype.up = function() {
        if (this.isRoot) {
          throw new Error("This node has no parent. Use doc() if you need to get the document object.");
        }
        return this.parent;
      };
      XMLFragment.prototype.root = function() {
        var child;
        if (this.isRoot) {
          return this;
        }
        child = this.parent;
        while (!child.isRoot) {
          child = child.parent;
        }
        return child;
      };
      XMLFragment.prototype.document = function() {
        var child;
        if (this.isDoc) {
          return this;
        }
        child = this.parent;
        while (!child.isDoc) {
          child = child.parent;
        }
        return child;
      };
      XMLFragment.prototype.prev = function() {
        var i;
        if (this.isRoot || this.isDoc) {
          throw new Error("Root node has no siblings");
        }
        i = this.parent.children.indexOf(this);
        if (i < 1) {
          throw new Error("Already at the first node");
        }
        return this.parent.children[i - 1];
      };
      XMLFragment.prototype.next = function() {
        var i;
        if (this.isRoot || this.isDoc) {
          throw new Error("Root node has no siblings");
        }
        i = this.parent.children.indexOf(this);
        if (i === -1 || i === this.parent.children.length - 1) {
          throw new Error("Already at the last node");
        }
        return this.parent.children[i + 1];
      };
      XMLFragment.prototype.attribute = function(name, value) {
        var _ref;
        if (!(name != null)) {
          throw new Error("Missing attribute name");
        }
        if (!(value != null)) {
          throw new Error("Missing attribute value");
        }
        name = '' + name || '';
        value = '' + value || '';
              if ((_ref = this.attributes) != null) {
          _ref;
        } else {
          this.attributes = {};
        };
        this.attributes[name] = this.escape(value);
        return this;
      };
      XMLFragment.prototype.removeAttribute = function(name) {
        if (!(name != null)) {
          throw new Error("Missing attribute name");
        }
        name = '' + name || '';
        delete this.attributes[name];
        return this;
      };
      XMLFragment.prototype.toString = function(options, level) {
        var attName, attValue, child, indent, newline, pretty, r, space, _i, _len, _ref, _ref2;
        pretty = (options != null) && options.pretty || false;
        indent = (options != null) && options.indent || '  ';
        newline = (options != null) && options.newline || '\n';
        level || (level = 0);
        space = new Array(level + 1).join(indent);
        r = '';
        if (pretty) {
          r += space;
        }
        if (!this.value) {
          r += '<' + this.name;
        } else {
          r += '' + this.value;
        }
        _ref = this.attributes;
        for (attName in _ref) {
          attValue = _ref[attName];
          if (this.name === '!DOCTYPE') {
            r += ' ' + attValue;
          } else {
            r += ' ' + attName + '="' + attValue + '"';
          }
        }
        if (this.children.length === 0) {
          if (!this.value) {
            r += this.name === '?xml' ? '?>' : this.name === '!DOCTYPE' ? '>' : '/>';
          }
          if (pretty) {
            r += newline;
          }
        } else if (pretty && this.children.length === 1 && this.children[0].value) {
          r += '>';
          r += this.children[0].value;
          r += '</' + this.name + '>';
          r += newline;
        } else {
          r += '>';
          if (pretty) {
            r += newline;
          }
          _ref2 = this.children;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            child = _ref2[_i];
            r += child.toString(options, level + 1);
          }
          if (pretty) {
            r += space;
          }
          r += '</' + this.name + '>';
          if (pretty) {
            r += newline;
          }
        }
        return r;
      };
      XMLFragment.prototype.escape = function(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');
      };
      XMLFragment.prototype.assertLegalChar = function(str) {
        var chars, chr;
        chars = /[\u0000-\u0008\u000B-\u000C\u000E-\u001F\uD800-\uDFFF\uFFFE-\uFFFF]/;
        chr = str.match(chars);
        if (chr) {
          throw new Error("Invalid character (" + chr + ") in string: " + str);
        }
      };
      XMLFragment.prototype.is = function(obj, type) {
        var clas;
        clas = Object.prototype.toString.call(obj).slice(8, -1);
        return (obj != null) && clas === type;
      };
      XMLFragment.prototype.ele = function(name, attributes, text) {
        return this.element(name, attributes, text);
      };
      XMLFragment.prototype.txt = function(value) {
        return this.text(value);
      };
      XMLFragment.prototype.dat = function(value) {
        return this.cdata(value);
      };
      XMLFragment.prototype.att = function(name, value) {
        return this.attribute(name, value);
      };
      XMLFragment.prototype.com = function(value) {
        return this.comment(value);
      };
      XMLFragment.prototype.doc = function() {
        return this.document();
      };
      XMLFragment.prototype.e = function(name, attributes, text) {
        return this.element(name, attributes, text);
      };
      XMLFragment.prototype.t = function(value) {
        return this.text(value);
      };
      XMLFragment.prototype.d = function(value) {
        return this.cdata(value);
      };
      XMLFragment.prototype.a = function(name, value) {
        return this.attribute(name, value);
      };
      XMLFragment.prototype.c = function(value) {
        return this.comment(value);
      };
      XMLFragment.prototype.r = function(value) {
        return this.raw(value);
      };
      XMLFragment.prototype.u = function() {
        return this.up();
      };
      return XMLFragment;
    })();
    module.exports = XMLFragment;
  }).call(this);
  

  provide("xmlbuilder/lXMLFragment", module.exports);
  provide("xmlbuilder/lXMLFragment", module.exports);
  $.ender(module.exports);
}(global));

// ender:xmlbuilder/lXMLBuilder as xmlbuilder/lXMLBuilder
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  (function() {
    var XMLBuilder, XMLFragment;
    var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
      for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
      function ctor() { this.constructor = child; }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor;
      child.__super__ = parent.prototype;
      return child;
    };
    XMLFragment =  require('xmlbuilder/lXMLFragment');
    XMLBuilder = (function() {
      function XMLBuilder() {
        XMLBuilder.__super__.constructor.call(this, null, '', {}, '');
        this.isDoc = true;
      }
      __extends(XMLBuilder, XMLFragment);
      XMLBuilder.prototype.begin = function(name, xmldec, doctype, options) {
        var att, child, root;
        if (!(name != null)) {
          throw new Error("Root element needs a name");
        }
        this.children = [];
        name = '' + name || '';
        if ((xmldec != null) && !(xmldec.version != null)) {
          throw new Error("Version number is required");
        }
        if (xmldec != null) {
          xmldec.version = '' + xmldec.version || '';
          if (!xmldec.version.match(/1\.[0-9]+/)) {
            throw new Error("Invalid version number: " + xmldec.version);
          }
          att = {
            version: xmldec.version
          };
          if (xmldec.encoding != null) {
            xmldec.encoding = '' + xmldec.encoding || '';
            if (!xmldec.encoding.match(/[A-Za-z](?:[A-Za-z0-9._-]|-)*/)) {
              throw new Error("Invalid encoding: " + xmldec.encoding);
            }
            att.encoding = xmldec.encoding;
          }
          if (xmldec.standalone != null) {
            att.standalone = xmldec.standalone ? "yes" : "no";
          }
          child = new XMLFragment(this, '?xml', att);
          this.children.push(child);
        }
        if (doctype != null) {
          att = {
            name: name
          };
          if (doctype.ext != null) {
            doctype.ext = '' + doctype.ext || '';
            att.ext = doctype.ext;
          }
          child = new XMLFragment(this, '!DOCTYPE', att);
          this.children.push(child);
        }
        root = new XMLFragment(this, name, {});
        root.isRoot = true;
        this.children.push(root);
        return root;
      };
      XMLBuilder.prototype.toString = function(options) {
        var child, r, _i, _len, _ref;
        r = '';
        _ref = this.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          r += child.toString(options);
        }
        return r;
      };
      return XMLBuilder;
    })();
    module.exports = XMLBuilder;
  }).call(this);
  

  provide("xmlbuilder/lXMLBuilder", module.exports);
  provide("xmlbuilder/lXMLBuilder", module.exports);
  $.ender(module.exports);
}(global));

// ender:xmlbuilder as xmlbuilder
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  (function() {
    var XMLBuilder;
    XMLBuilder =  require('xmlbuilder/lXMLBuilder');
    module.exports.create = function() {
      return new XMLBuilder();
    };
  }).call(this);
  

  provide("xmlbuilder", module.exports);
  provide("xmlbuilder", module.exports);
  $.ender(module.exports);
}(global));

// ender:ahr2/utils as ahr2/utils
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  /*jslint white: false, onevar: true, undef: true, node: true, nomen: true, regexp: false, plusplus: true, bitwise: true, es5: true, newcap: true, maxerr: 5 */
  (function () {
    "use strict";
  
    var utils = exports
      , jsonpRegEx = /\s*([\$\w]+)\s*\(\s*(.*)\s*\)\s*/;
  
    utils.clone = function (obj) {
      return JSON.parse(JSON.stringify(obj));
    };
  
    // useful for extending global options onto a local variable
    utils.extend = function (global, local) {
      //global = utils.clone(global);
      Object.keys(local).forEach(function (key) {
        global[key] = local[key] || global[key];
      });
      return global;
    };
  
    // useful for extending global options onto a local variable
    utils.preset = function (local, global) {
      // TODO copy functions
      // TODO recurse / deep copy
      global = utils.clone(global);
      Object.keys(global).forEach(function (key) {
        if ('undefined' === typeof local[key]) {
          local[key] = global[key];
        }
      });
      return local;
    };
  
    utils.objectToLowerCase = function (obj, recurse) {
      // Make headers all lower-case
      Object.keys(obj).forEach(function (key) {
        var value;
  
        value = obj[key];
        delete obj[key];
        if ('string' === typeof value) {
          obj[key.toLowerCase()] = value.toLowerCase();
        }
      });
      return obj;
    };
  
    utils.parseJsonp = function (jsonpCallback, jsonp) {
      var match = jsonp.match(jsonpRegEx)
        , data
        , json;
  
      if (!match || !match[1] || !match[2]) {
        throw new Error('No JSONP matched');
      }
      if (jsonpCallback !== match[1]) {
        throw new Error('JSONP callback doesn\'t match');
      }
      json = match[2];
  
      data = JSON.parse(json);
      return data;
    };
  
    utils.uriEncodeObject = function(json) {
      var query = '';
  
      try {
        JSON.parse(JSON.stringify(json));
      } catch(e) {
        return 'ERR_CYCLIC_DATA_STRUCTURE';
      }
  
      if ('object' !== typeof json) {
        return 'ERR_NOT_AN_OBJECT';
      }
  
      Object.keys(json).forEach(function (key) {
        var param, value;
  
        // assume that the user meant to delete this element
        if ('undefined' === typeof json[key]) {
          return;
        }
  
        param = encodeURIComponent(key);
        value = encodeURIComponent(json[key]);
        query += '&' + param;
  
        // assume that the user wants just the param name sent
        if (null !== json[key]) {
          query += '=' + value;
        }
      });
  
      // remove first '&'
      return query.substring(1);
    };
  
    utils.addParamsToUri = function(uri, params) {
      var query
        , anchor = ''
        , anchorpos;
  
      uri = uri || "";
      anchor = '';
      params = params || {};
  
      // just in case this gets used client-side
      if (-1 !== (anchorpos = uri.indexOf('#'))) {
        anchor = uri.substr(anchorpos);
        uri = uri.substr(0, anchorpos);
      }
  
      query = utils.uriEncodeObject(params);
  
      // cut the leading '&' if no other params have been written
      if (query.length > 0) {
        if (!uri.match(/\?/)) {
          uri += '?' + query;
        } else {
          uri += '&' + query;
        }
      }
  
      return uri + anchor;
    };
  }());
  

  provide("ahr2/utils", module.exports);
  provide("ahr2/utils", module.exports);
  $.ender(module.exports);
}(global));

// ender:ahr2/browser/jsonp as ahr2/browser/jsonp
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  /*
     loadstart;
     progress;
     abort;
     error;
     load;
     timeout;
     loadend;
  */
  (function () {
    "use strict";
  
    function browserJsonpClient(req, res) {
      // TODO check for Same-domain / XHR2/CORS support
      // before attempting to insert script tag
      // Those support headers and such, which are good
      var options = req.userOptions
        , cbkey = options.jsonpCallback
        , script = document.createElement("script")
        , head = document.getElementsByTagName("head")[0] || document.documentElement
        , addParamsToUri =  require('ahr2/utils').addParamsToUri
        , timeout
        , fulfilled; // TODO move this logic elsewhere into the emitter
  
      // cleanup: cleanup window and dom
      function cleanup() {
        fulfilled = true;
        window[cbkey] = undefined;
        try {
          delete window[cbkey];
          // may have already been removed
          head.removeChild(script);
        } catch(e) {}
      }
  
      function abortRequest() {
        req.emit('abort');
        cleanup();
      }
  
      function abortResponse() {
        res.emit('abort');
        cleanup();
      }
  
      function prepareResponse() {
        // Sanatize data, Send, Cleanup
        function onSuccess(data) {
          var ev = {
            lengthComputable: false,
            loaded: 1,
            total: 1
          };
          if (fulfilled) {
            return;
          }
  
          clearTimeout(timeout);
          res.emit('loadstart', ev);
          // sanitize
          data = JSON.parse(JSON.stringify(data));
          res.emit('progress', ev);
          ev.target = { result: data };
          res.emit('load', ev);
          cleanup();
        }
  
        function onTimeout() {
          res.emit('timeout', {});
          res.emit('error', new Error('timeout'));
          cleanup();
        }
  
        window[cbkey] = onSuccess;
        // onError: Set timeout if script tag fails to load
        if (options.timeout) {
          timeout = setTimeout(onTimeout, options.timeout);
        }
      }
  
      function makeRequest() {
        var ev = {}
          , jsonp = {};
  
        function onError(ev) {
          res.emit('error', ev);
        }
  
        // ?search=kittens&jsonp=jsonp123456
        jsonp[options.jsonp] = options.jsonpCallback;
        options.href = addParamsToUri(options.href, jsonp);
  
        // Insert JSONP script into the DOM
        // set script source to the service that responds with thepadded JSON data
        req.emit('loadstart', ev);
        try {
          script.setAttribute("type", "text/javascript");
          script.setAttribute("async", "async");
          script.setAttribute("src", options.href);
          // Note that this only works in some browsers,
          // but it's better than nothing
          script.onerror = onError;
          head.insertBefore(script, head.firstChild);
        } catch(e) {
          req.emit('error', e);
        }
  
        // failsafe cleanup
        setTimeout(cleanup, 2 * 60 * 1000);
        // a moot point since the "load" occurs so quickly
        req.emit('progress', ev);
        req.emit('load', ev);
      }
  
      setTimeout(makeRequest, 0);
      req.abort = abortRequest;
      res.abort = abortResponse;
      prepareResponse();
  
      return res;
    }
  
    module.exports = browserJsonpClient;
  }());
  

  provide("ahr2/browser/jsonp", module.exports);
  provide("ahr2/browser/jsonp", module.exports);
  $.ender(module.exports);
}(global));

// ender:ahr2/options as ahr2/options
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  /*jslint devel: true, debug: true, es5: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */
  (function () {
    "use strict";
  
    var globalOptions
      , ahrOptions = exports
      , url = require('url')
      , querystring = require('querystring')
      , File = require('File')
      , FileList = require('FileList')
      , atob = require('atob')
      , utils =  require('ahr2/utils')
      , location
      , uriEncodeObject
      , clone
      , preset
      , objectToLowerCase
      ;
  
    /*
     * Some browsers don't yet have support for FormData.
     * This isn't a real fix, but it stops stuff from crashing.
     * 
     * This should probably be replaced with a real FormData impl, but whatever.
     */
    function FormData() {
    }
    
    try {
      FormData = require('FormData');
    } catch (e) {
      console.warn('FormData does not exist; using a NOP instead');
    }
  
    // TODO get the "root" dir... somehow
    try {
      location = require('./location');
    } catch(e) {
      location = require('location');
    }
  
    uriEncodeObject = utils.uriEncodeObject;
    clone = utils.clone;
    preset = utils.preset;
    objectToLowerCase = utils.objectToLowerCase;
  
    globalOptions = {
      ssl: false,
      method: 'GET',
      headers: {
        //'accept': "application/json; charset=utf-8, */*; q=0.5"
      },
      redirectCount: 0,
      redirectCountMax: 5,
      // contentType: 'json',
      // accept: 'json',
      followRedirect: true,
      timeout: 20000
    };
  
  
    //
    // Manage global options while keeping state safe
    //
    ahrOptions.globalOptionKeys = function () {
      return Object.keys(globalOptions);
    };
  
    ahrOptions.globalOption = function (key, val) {
      if ('undefined' === typeof val) {
        return globalOptions[key];
      }
      if (null === val) {
        val = undefined;
      }
      globalOptions[key] = val;
    };
  
    ahrOptions.setGlobalOptions = function (bag) {
      Object.keys(bag).forEach(function (key) {
        globalOptions[key] = bag[key];
      });
    };
  
  
    /*
     * About the HTTP spec and which methods allow bodies, etc:
     * http://stackoverflow.com/questions/299628/is-an-entity-body-allowed-for-an-http-delete-request
     */
    function checkBodyAllowed(options) {
      var method = options.method.toUpperCase();
      if ('HEAD' !== method && 'GET' !== method && 'DELETE' !== method && 'OPTIONS' !== method) {
        return true;
      }
      if (options.body && !options.forceAllowBody) {
        throw new Error("The de facto standard is that '" + method + "' should not have a body.\n" +
          "Most web servers just ignore it. Please use 'query' rather than 'body'.\n" +
          "Also, you may consider filing this as a bug - please give an explanation.\n" +
          "Finally, you may allow this by passing { forceAllowBody: 'true' } ");
      }
      if (options.body && options.jsonp) {
        throw new Error("The de facto standard is that 'jsonp' should not have a body (and I don't see how it could have one anyway).\n" +
          "If you consider filing this as a bug please give an explanation.");
      }
    }
  
  
    /*
      Node.js
  
      > var url = require('url');
      > var urlstring = 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash';
      > url.parse(urlstring, true);
      { href: 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash',
        protocol: 'http:',
        host: 'user:pass@host.com:8080',
        auth: 'user:pass',
        hostname: 'host.com',
        port: '8080',
        pathname: '/p/a/t/h',
        search: '?query=string',
        hash: '#hash',
  
        slashes: true,
        query: {'query':'string'} } // 'query=string'
    */
  
    /*
      Browser
  
        href: "http://user:pass@host.com:8080/p/a/t/h?query=string#hash"
        protocol: "http:" 
        host: "host.com:8080"
        hostname: "host.com"
        port: "8080"
        pathname: "/p/a/t/h"
        search: '?query=string',
        hash: "#hash"
  
        origin: "http://host.com:8080"
     */
  
    function handleUri(options) {
      var presets
        , urlObj
        ;
  
      presets = clone(globalOptions);
  
      if (!options) {
        throw new Error('ARe yOu kiddiNg me? You have to provide some sort of options');
      }
  
      if ('string' === typeof options) {
        options = {
          href: options
        };
      }
      if (options.uri || options.url) {
        console.log('Use `options.href`. `options.url` and `options.uri` are obsolete');
        options.href = options.href || options.url || options.url;
      }
      if (options.params) {
        console.log('Use `options.query`. `options.params` is obsolete');
        options.query = options.query || options.params;
      }
  
  
      //
      // pull `urlObj` from `options`
      //
      if (options.href) {
        urlObj = url.parse(options.href, true, true);
        // ignored anyway
        delete urlObj.href;
        // these trump other options
        delete urlObj.host;
        delete urlObj.search;
      } else {
        urlObj = {
            protocol: options.protocol || location.protocol
        //  host trumps auth, hostname, and port
          , host: options.host
          , auth: options.auth
          , hostname: options.hostname || location.hostname
          , port: options.port || location.port
          , pathname: url.resolve(location.pathname, options.pathname || '') || '/'
        // search trumps query
        //, search: options.search
          , query: options.query || querystring.parse(options.search||"")
          , hash: options.hash
        };
      }
      delete options.href;
      delete options.host;
      delete options.auth;
      delete options.hostname;
      delete options.port;
      delete options.path;
      delete options.search;
      delete options.query;
      delete options.hash;
  
      // Use SSL if desired
      if ('https:' === urlObj.protocol || '443' === urlObj.port || true === options.ssl) {
        options.ssl = true;
        urlObj.port = urlObj.port || '443';
        // hopefully no one would set prt 443 to standard http
        urlObj.protocol = 'https:';
      }
  
      if ('tcp:' === urlObj.protocol || 'tcps:' === urlObj.protocol || 'udp:' === urlObj.protocol) {
        options.method = options.method || 'POST';
      }
  
      if (!options.method && (options.body || options.encodedBody)) {
        options.method = 'POST';
      }
  
      if (options.jsonp) {
        // i.e. /path/to/res?x=y&jsoncallback=jsonp8765
        // i.e. /path/to/res?x=y&json=jsonp_ae75f
        options.jsonpCallback = 'jsonp_' + (new Date()).valueOf();
        options.dataType = 'jsonp';
        urlObj.query[options.jsonp] = options.jsonpCallback;
      }
  
      // for the sake of the browser, but it doesn't hurt node
      if (!urlObj.auth && options.username && options.password) {
        urlObj.auth = options.username + ':' + options.password;
      } else if (urlObj.auth) {
        urlObj.username = urlObj.auth.split(':')[0];
        urlObj.password = urlObj.auth.split(':')[1];
      }
  
      urlObj.href = url.format(urlObj);
      urlObj = url.parse(urlObj.href, true, true);
  
      preset(options, presets);
      preset(options, urlObj);
      options.syncback = options.syncback || function () {};
  
      return options;
    }
  
    function handleHeaders(options) {
      var presets
        , ua
        ;
  
      presets = clone(globalOptions);
  
      options.headers = options.headers || {};
      if (options.jsonp) {
        options.headers.accept = "text/javascript";
      }
      // TODO user-agent should retain case
      options.headers = objectToLowerCase(options.headers || {});
      options.headers = preset(options.headers, presets.headers);
      // TODO port?
      options.headers.host = options.hostname;
      options.headers = objectToLowerCase(options.headers);
      if (options.contentType) {
        options.headers['content-type'] = options.contentType;
      }
  
      // for the sake of node, but it doesn't hurt the browser
      if (options.auth) {
        options.headers.authorization = 'Basic ' + atob(options.auth);
      }
  
      return options;
    }
  
    function hasFiles(body, formData) {
      var hasFile = false;
      if ('object' !== typeof body) {
        return false;
      }
      Object.keys(body).forEach(function (key) {
        var item = body[key];
        if (item instanceof File) {
          hasFile = true;
        } else if (item instanceof FileList) {
          hasFile = true;
        }
      });
      return hasFile;
    }
    function addFiles(body, formData) {
  
      Object.keys(body).forEach(function (key) {
        var item = body[key];
  
        if (item instanceof File) {
          formData.append(key, item);
        } else if (item instanceof FileList) {
          item.forEach(function (file) {
            formData.append(key, file);
          });
        } else {
          formData.append(key, item);
        }
      });
    }
  
    // TODO convert object/map body into array body
    // { "a": 1, "b": 2 } --> [ "name": "a", "value": 1, "name": "b", "value": 2 ]
    // this would be more appropriate and in better accordance with the http spec
    // as it allows for a value such as "a" to have multiple values rather than
    // having to do "a1", "a2" etc
    function handleBody(options) {
      function bodyEncoder() {
        checkBodyAllowed(options);
  
        if (options.encodedBody) {
          return;
        }
  
        //
        // Check for HTML5 FileApi files
        //
        if (hasFiles(options.body)) {
          options.encodedBody = new FormData(); 
          addFiles(options.body, options.encodedBody);
        }
        if (options.body instanceof FormData) {
          options.encodedBody = options.body;
        }
        if (options.encodedBody instanceof FormData) {
            // TODO: is this necessary? This breaks in the browser
  //        options.headers["content-type"] = "multipart/form-data";
          return;
        }
  
        if ('string' === typeof options.body) {
          options.encodedBody = options.body;
        }
  
        if (!options.headers["content-type"]) {
          //options.headers["content-type"] = "application/x-www-form-urlencoded";
          options.headers["content-type"] = "application/json";
        }
  
        if (!options.encodedBody) {
          if (options.headers["content-type"].match(/application\/json/) || 
              options.headers["content-type"].match(/text\/javascript/)) {
            options.encodedBody = JSON.stringify(options.body);
          } else if (options.headers["content-type"].match(/application\/x-www-form-urlencoded/)) {
              options.encodedBody = uriEncodeObject(options.body);
          }
  
          if (!options.encodedBody) {
            throw new Error("'" + options.headers["content-type"] + "'" + "is not yet supported and you have not specified 'encodedBody'");
          }
  
          options.headers["content-length"] = options.encodedBody.length;
        }
      }
  
      function removeContentBodyAndHeaders() {
        if (options.body) {
          throw new Error('You gave a body for one of HEAD, GET, DELETE, or OPTIONS');
        }
  
        options.encodedBody = "";
        options.headers["content-type"] = undefined;
        options.headers["content-length"] = undefined;
        options.headers["transfer-encoding"] = undefined;
        delete options.headers["content-type"];
        delete options.headers["content-length"];
        delete options.headers["transfer-encoding"];
      }
  
      if ('file:' === options.protocol) {
        options.header = undefined;
        delete options.header;
        return;
      }
  
      // Create & Send body
      // TODO support streaming uploads
      options.headers["transfer-encoding"] = undefined;
      delete options.headers["transfer-encoding"];
  
      if (options.body || options.encodedBody) {
        bodyEncoder(options);
      } else { // no body || body not allowed
        removeContentBodyAndHeaders(options);
      }
    }
  
    ahrOptions.handleOptions = function (options) {
      handleUri(options);
      handleHeaders(options);
      handleBody(options);
  
      return options;
    };
  }());
  

  provide("ahr2/options", module.exports);
  provide("ahr2/options", module.exports);
  $.ender(module.exports);
}(global));

// ender:ahr2/browser as ahr2/browser
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  /*jslint devel: true, debug: true, es5: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */
  // This module is meant for modern browsers. Not much abstraction or 1337 majic
  (function (undefined) {
    "use strict";
  
    var url //= require('url')
      , browserJsonpClient =  require('ahr2/browser/jsonp')
      , triedHeaders = {}
      , nativeHttpClient
      , globalOptions
      , restricted
      , debug = false
      ; // TODO underExtend localOptions
  
    // Restricted Headers
    // http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method
    restricted = [
        "Accept-Charset"
      , "Accept-Encoding"
      , "Connection"
      , "Content-Length"
      , "Cookie"
      , "Cookie2"
      , "Content-Transfer-Encoding"
      , "Date"
      , "Expect"
      , "Host"
      , "Keep-Alive"
      , "Referer"
      , "TE"
      , "Trailer"
      , "Transfer-Encoding"
      , "Upgrade"
      , "User-Agent"
      , "Via"
    ];
    restricted.forEach(function (val, i, arr) {
      arr[i] = val.toLowerCase();
    });
  
    if (!window.XMLHttpRequest) {
      window.XMLHttpRequest = function() {
        return new ActiveXObject('Microsoft.XMLHTTP');
      };
    }
    if (window.XDomainRequest) {
      // TODO fix IE's XHR/XDR to act as normal XHR2
      // check if the location.host is the same (name, port, not protocol) as origin
    }
  
  
    function encodeData(options, xhr2) {
      var data
        , ct = options.overrideResponseType || xhr2.getResponseHeader("content-type") || ""
        , text
        , len
        ;
  
      ct = ct.toLowerCase();
  
      if (xhr2.responseType && xhr2.response) {
        text = xhr2.response;
      } else {
        text = xhr2.responseText;
      }
  
      len = text.length;
  
      if ('binary' === ct) {
        if (window.ArrayBuffer && xhr2.response instanceof window.ArrayBuffer) {
          return xhr2.response;
        }
  
        // TODO how to wrap this for the browser and Node??
        if (options.responseEncoder) {
          return options.responseEncoder(text);
        }
  
        // TODO only Chrome 13 currently handles ArrayBuffers well
        // imageData could work too
        // http://synth.bitsnbites.eu/
        // http://synth.bitsnbites.eu/play.html
        // var ui8a = new Uint8Array(data, 0);
        var i
          , ui8a = Array(len)
          ;
  
        for (i = 0; i < text.length; i += 1) {
          ui8a[i] = (text.charCodeAt(i) & 0xff);
        }
  
        return ui8a;
      }
  
      if (ct.indexOf("xml") >= 0) {
        return xhr2.responseXML;
      }
  
      if (ct.indexOf("jsonp") >= 0 || ct.indexOf("javascript") >= 0) {
        console.log("forcing of jsonp not yet supported");
        return text;
      }
  
      if (ct.indexOf("json") >= 0) {
        try {
          data = JSON.parse(text);
        } catch(e) {
          data = text;
        }
        return data;
      }
  
      return xhr2.responseText;
    }
  
    function browserHttpClient(req, res) {
      var options = req.userOptions
        , xhr2
        , xhr2Request
        , timeoutToken
        ;
  
      function onTimeout() {
        req.emit("timeout", new Error("timeout after " + options.timeout + "ms"));
      }
  
      function resetTimeout() {
        clearTimeout(timeoutToken);
        timeoutToken = setTimeout(onTimeout, options.timeout);
      }
  
      function sanatizeHeaders(header) {
        var value = options.headers[header]
          , headerLc = header.toLowerCase()
          ;
  
        // only warn the user once about bad headers
        if (-1 !== restricted.indexOf(header.toLowerCase())) {
          if (!triedHeaders[headerLc]) {
            console.warn('Ignoring all attempts to set restricted header ' + header + '. See (http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method)');
          }
          triedHeaders[headerLc] = true;
          return;
        }
  
        try {
          // throws INVALID_STATE_ERROR if called before `open()`
          xhr2.setRequestHeader(header, value);
        } catch(e) {
          console.error('failed to set header: ' + header);
          console.error(e);
        }
      }
  
      // A little confusing that the request object gives you
      // the response handlers and that the upload gives you
      // the request handlers, but oh well
      xhr2 = new XMLHttpRequest();
      xhr2Request = xhr2.upload;
  
      /* Proper States */
      xhr2.addEventListener('loadstart', function (ev) {
          // this fires when the request starts,
          // but shouldn't fire until the request has loaded
          // and the response starts
          req.emit('loadstart', ev);
          resetTimeout();
      }, true);
      xhr2.addEventListener('progress', function (ev) {
          if (!req.loaded) {
            req.loaded = true;
            req.emit('progress', {});
            req.emit('load', {});
          }
          if (!res.loadstart) {
            res.headers = xhr2.getAllResponseHeaders();
            res.loadstart = true;
            res.emit('loadstart', ev);
          }
          res.emit('progress', ev);
          resetTimeout();
      }, true);
      xhr2.addEventListener('load', function (ev) {
        if (xhr2.status >= 400) {
          ev.error = new Error(xhr2.status);
        }
        ev.target.result = encodeData(options, xhr2);
        res.emit('load', ev);
      }, true);
      /*
      xhr2Request.addEventListener('loadstart', function (ev) {
        req.emit('loadstart', ev);
        resetTimeout();
      }, true);
      */
      xhr2Request.addEventListener('load', function (ev) {
        resetTimeout();
        req.loaded = true;
        req.emit('load', ev);
        res.loadstart = true;
        res.emit('loadstart', {});
      }, true);
      xhr2Request.addEventListener('progress', function (ev) {
        resetTimeout();
        req.emit('progress', ev);
      }, true);
  
  
      /* Error States */
      xhr2.addEventListener('abort', function (ev) {
        res.emit('abort', ev);
      }, true);
      xhr2Request.addEventListener('abort', function (ev) {
        req.emit('abort', ev);
      }, true);
      xhr2.addEventListener('error', function (ev) {
        res.emit('error', ev);
      }, true);
      xhr2Request.addEventListener('error', function (ev) {
        req.emit('error', ev);
      }, true);
      // the "Request" is what timeouts
      // the "Response" will timeout as well
      xhr2.addEventListener('timeout', function (ev) {
        req.emit('timeout', ev);
      }, true);
      xhr2Request.addEventListener('timeout', function (ev) {
        req.emit('timeout', ev);
      }, true);
  
      /* Cleanup */
      res.on('loadend', function () {
        // loadend is managed by AHR
        req.status = xhr2.status;
        res.status = xhr2.status;
        clearTimeout(timeoutToken);
      });
  
      if (options.username) {
        xhr2.open(options.method, options.href, true, options.username, options.password);
      } else {
        xhr2.open(options.method, options.href, true);
      }
  
      Object.keys(options.headers).forEach(sanatizeHeaders);
  
      setTimeout(function () {
        if ('binary' === options.overrideResponseType) {
          xhr2.overrideMimeType("text/plain; charset=x-user-defined");
          xhr2.responseType = 'arraybuffer';
        }
        try {
          xhr2.send(options.encodedBody);
        } catch(e) {
          req.emit('error', e);
        }
      }, 1);
      
  
      req.abort = function () {
        xhr2.abort();
      };
      res.abort = function () {
        xhr2.abort();
      };
  
      res.browserRequest = xhr2;
      return res;
    }
  
    function send(req, res) {
      var options = req.userOptions;
      // TODO fix this ugly hack
      url = url || require('url');
      if (options.jsonp && options.jsonpCallback) {
        return browserJsonpClient(req, res);
      }
      return browserHttpClient(req, res);
    }
  
    module.exports = send;
  }());
  

  provide("ahr2/browser", module.exports);
  provide("ahr2/browser", module.exports);
  $.ender(module.exports);
}(global));

// ender:ahr2 as ahr2
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  /*jslint devel: true, debug: true, es5: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */
  (function () {
    "use strict";
  
    var EventEmitter = require('events').EventEmitter
      , Future = require('future')
      , Join = require('join')
      , ahrOptions
      , nextTick
      , utils
      , preset
      ;
  
    function nextTick(fn, a, b, c, d) {
      try {
        process.nextTick(fn, a, b, c, d);
      } catch(e) {
        setTimeout(fn, 0, a, b, c, d);
      }
    }
  
    ahrOptions =  require('ahr2/options');
    utils =  require('ahr2/utils');
    
    preset = utils.preset;
  
    // The normalization starts here!
    function NewEmitter() {
      var emitter = new EventEmitter()
        , promise = Future()
        , ev = {
              lengthComputable: false
            , loaded: 0
            , total: undefined
          };
  
      function loadend(ev, errmsg) {
        ev.error = errmsg && new Error(errmsg);
        nextTick(function () {
          emitter.emit('loadend', ev);
        });
      }
  
      emitter.done = 0;
  
      // any error in the quest causes the response also to fail
      emitter.on('loadend', function (ev) {
        emitter.done += 1;
  
        if (emitter.done > 1) {
          console.warn('loadend called ' + emitter.done + ' times', emitter, ev);
          return;
        }
  
        // in FF this is only a getter, setting is not allowed
        if (!ev.target) {
          ev.target = {};
        }
  
        promise.fulfill(emitter.error || ev.error, emitter, ev.target.result, ev.error ? false : true);
      });
  
      emitter.on('timeout', function (ev) {
        emitter.error = ev;
        loadend(ev, 'timeout');
      });
  
      emitter.on('abort', function (ev) {
        loadend(ev, 'abort');
      });
  
      emitter.on('error', function (err, evn) {
        // TODO rethrow the error if there are no listeners (incl. promises)
        //if (respEmitter.listeners.loadend) {}
  
        emitter.error = err;
        ev.error = err;
        if (evn) {
          ev.lengthComputable = evn.lengthComputable || true;
          ev.loaded = evn.loaded || 0;
          ev.total = evn.total;
        }
        loadend(ev);
      });
  
      // TODO there can actually be multiple load events per request
      // as is the case with mjpeg, streaming media, and ad-hoc socket-ish things
      emitter.on('load', function (evn) {
        // ensure that `loadend` is after `load` for all interested parties
        loadend(evn);
      });
  
      // TODO 3.0 remove when
      emitter.when = promise.when;
  
      return emitter;
    }
  
  
    //
    // Emulate `request`
    //
    function ahr(options, callback) {
      var NativeHttpClient
        , req = NewEmitter()
        , res = NewEmitter()
        ;
  
      if (callback || options.callback) {
        // TODO 3.0 remove when
        return ahr(options).when(callback);
      }
  
      if ('string' === typeof options) {
        options = {
          href: options
        };
      }
  
      ahrOptions.handleOptions(options);
  
      // todo throw all the important properties in the request
      req.userOptions = options;
      // in the browser tradition
      res.upload = req;
  
      // if the request fails, then the response must also fail
      req.on('error', function (err, ev) {
        if (!res.error) {
          res.emit('error', err, ev);
        }
      });
      req.on('timeout', function (ev) {
        if (!res.error) {
          res.emit('timeout', ev);
        }
      });
      req.on('abort', function (ev) {
        if (!res.error) {
          res.emit('abort', ev);
        }
      });
  
      try {
        // tricking pakmanager to ignore the node stuff
        var client = './node';
        NativeHttpClient = require(client);
      } catch(e) {
        NativeHttpClient =  require('ahr2/browser');
      }
  
      return NativeHttpClient(req, res);
    };
    ahr.globalOptionKeys = ahrOptions.globalOptionKeys;
    ahr.globalOption = ahrOptions.globalOption;
    ahr.setGlobalOptions = ahrOptions.setGlobalOptions;
    ahr.handleOptions = ahrOptions.handleOptions;
  
  
    // TODO 3.0 remove join
    ahr.join = Join;
  
  
    //
    //
    // All of these convenience methods are safe to cut if needed to save kb
    //
    //
    function allRequests(method, href, query, body, jsonp, options, callback) {
      options = options || {};
  
      if (method) { options.method = method; }
      if (href) { options.href = href; }
      if (jsonp) { options.jsonp = jsonp; }
  
      if (query) { options.query = preset((query || {}), (options.query || {})) }
      if (body) { options.body = body; }
  
      return ahr(options, callback);
    }
  
    ahr.http = ahr;
    ahr.file = ahr;
    // TODO copy the jquery / reqwest object syntax
    // ahr.ajax = ahr;
  
    // HTTP jQuery-like body-less methods
    ['HEAD', 'GET', 'DELETE', 'OPTIONS'].forEach(function (verb) {
      verb = verb.toLowerCase();
      ahr[verb] = function (href, query, options, callback) {
        return allRequests(verb, href, query, undefined, undefined, options, callback);
      };
    });
  
    // Correcting an oversight of jQuery.
    // POST and PUT can have both query (in the URL) and data (in the body)
    ['POST', 'PUT'].forEach(function (verb) {
      verb = verb.toLowerCase();
      ahr[verb] = function (href, query, body, options, callback) {
        return allRequests(verb, href, query, body, undefined, options, callback);
      };
    });
  
    // JSONP
    ahr.jsonp = function (href, jsonp, query, options, callback) {
      if (!jsonp || 'string' !== typeof jsonp) {
        throw new Error("'jsonp' is not an optional parameter.\n" +
          "If you believe that this should default to 'callback' rather" +
          "than throwing an error, please file a bug");
      }
  
      return allRequests('GET', href, query, undefined, jsonp, options, callback);
    };
  
    // HTTPS
    ahr.https = function (options, callback) {
      if ('string' === typeof options) {
        options = {
          href: options
        };
      }
  
      options.ssl = true;
      options.protocol = "https:";
  
      return ahr(options, callback);
    };
  
    ahr.tcp = function (options, callback) {
      if ('string' === typeof options) {
        options = {
          href: options
        };
      }
  
      options.protocol = "tcp:";
  
      return ahr(options, callback);
    };
  
    ahr.udp = function (options, callback) {
      if ('string' === typeof options) {
        options = {
          href: options
        };
      }
  
      options.protocol = "udp:";
  
      return ahr(options, callback);
    };
  
    module.exports = ahr;
  }());
  

  provide("ahr2", module.exports);
  provide("ahr2", module.exports);
  $.ender(module.exports);
}(global));

// ender:xmlrpc/ldate-formatter.js as xmlrpc/ldate-formatter.js
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  var dateFormatter = exports
  
  /*
   * Converts a date time stamp following the ISO8601 format to a JavaScript Date
   * object.
   *
   * @param {String} time - String representation of timestamp.
   * @return {Date}       - Date object from timestamp.
   */
  dateFormatter.decodeIso8601 = function(time) {
  
    var regexp = '([0-9]{4})([-]?([0-9]{2})([-]?([0-9]{2})'
      + '(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?'
      + '(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?'
  
    var d = time.toString().match(new RegExp(regexp))
  
    var offset = 0
    var date = new Date(d[1], 0, 1)
  
    if (d[3]) {
      date.setMonth(d[3] - 1)
    }
    if (d[5]) {
      date.setDate(d[5])
    }
    if (d[7]) {
      date.setHours(d[7])
    }
    if (d[8]) {
      date.setMinutes(d[8])
    }
    if (d[10]) {
      date.setSeconds(d[10])
    }
    if (d[12]) {
      date.setMilliseconds(Number('0.' + d[12]) * 1000)
    }
  
    return date
  }
  
  /**
   * Converts a JavaScript Date object to an ISO8601 timestamp.
   *
   * @param {Date} date - Date object.
   * @return {String}   - String representation of timestamp.
   */
  dateFormatter.encodeIso8601 = function(date) {
    return zeroPad(date.getFullYear(), 4)
      + zeroPad(date.getMonth() + 1, 2)
      + zeroPad(date.getDate(), 2)
      + 'T'
      + zeroPad(date.getHours(), 2)
      + ':'
      + zeroPad(date.getMinutes(), 2)
      + ':'
      + zeroPad(date.getSeconds(), 2)
  }
  
  /**
   * Helper function to pad the digits with 0s to meet date formatting
   * requirements.
   *
   * @param {Number} digit  - The number to pad.
   * @param {Number} length - Length of digit string, prefix with 0s if not
   *                          already length.
   * @return {String}       - String with the padded digit
   */
  function zeroPad(digit, length) {
    var padded = '' + digit
    while (padded.length < length) {
      padded = '0' + padded
    }
  
    return padded
  }
  
  

  provide("xmlrpc/ldate-formatter.js", module.exports);
  provide("xmlrpc/ldate-formatter.js", module.exports);
  $.ender(module.exports);
}(global));

// ender:xmlrpc/lturl as xmlrpc/lturl
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  // This is a copy of url.js that does not depend on any core modules of
  // node.js. Therefore it can be used in the browser through in pakmanager etc.
  
  exports.parse = urlParse;
  exports.resolve = urlResolve;
  exports.resolveObject = urlResolveObject;
  exports.format = urlFormat;
  
  // Reference: RFC 3986, RFC 1808, RFC 2396
  
  // define these here so at least they only have to be
  // compiled once on the first module load.
  var protocolPattern = /^([a-z0-9.+-]+:)/i,
      portPattern = /:[0-9]+$/,
      // RFC 2396: characters reserved for delimiting URLs.
      delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
      // RFC 2396: characters not allowed for various reasons.
      unwise = ['{', '}', '|', '\\', '^', '~', '[', ']', '`'].concat(delims),
      // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
      autoEscape = ['\''],
      // Characters that are never ever allowed in a hostname.
      // Note that any invalid chars are also handled, but these
      // are the ones that are *expected* to be seen, so we fast-path
      // them.
      nonHostChars = ['%', '/', '?', ';', '#']
        .concat(unwise).concat(autoEscape),
      nonAuthChars = ['/', '@', '?', '#'].concat(delims),
      hostnameMaxLen = 255,
      hostnamePartPattern = /^[a-zA-Z0-9][a-z0-9A-Z_-]{0,62}$/,
      hostnamePartStart = /^([a-zA-Z0-9][a-z0-9A-Z_-]{0,62})(.*)$/,
      // protocols that can allow "unsafe" and "unwise" chars.
      unsafeProtocol = {
        'javascript': true,
        'javascript:': true
      },
      // protocols that never have a hostname.
      hostlessProtocol = {
        'javascript': true,
        'javascript:': true
      },
      // protocols that always have a path component.
      pathedProtocol = {
        'http': true,
        'https': true,
        'ftp': true,
        'gopher': true,
        'file': true,
        'http:': true,
        'ftp:': true,
        'gopher:': true,
        'file:': true
      },
      // protocols that always contain a // bit.
      slashedProtocol = {
        'http': true,
        'https': true,
        'ftp': true,
        'gopher': true,
        'file': true,
        'http:': true,
        'https:': true,
        'ftp:': true,
        'gopher:': true,
        'file:': true
      };
  
  function urlParse(url, parseQueryString, slashesDenoteHost) {
    if (url && typeof(url) === 'object' && url.href) return url;
  
    if (typeof url !== 'string') {
      throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
    }
  
    var out = {},
        rest = url;
  
    // cut off any delimiters.
    // This is to support parse stuff like "<http://foo.com>"
    for (var i = 0, l = rest.length; i < l; i++) {
      if (delims.indexOf(rest.charAt(i)) === -1) break;
    }
    if (i !== 0) rest = rest.substr(i);
  
  
    var proto = protocolPattern.exec(rest);
    if (proto) {
      proto = proto[0];
      var lowerProto = proto.toLowerCase();
      out.protocol = lowerProto;
      rest = rest.substr(proto.length);
    }
  
    // figure out if it's got a host
    // user@server is *always* interpreted as a hostname, and url
    // resolution will treat //foo/bar as host=foo,path=bar because that's
    // how the browser resolves relative URLs.
    if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
      var slashes = rest.substr(0, 2) === '//';
      if (slashes && !(proto && hostlessProtocol[proto])) {
        rest = rest.substr(2);
        out.slashes = true;
      }
    }
  
    if (!hostlessProtocol[proto] &&
        (slashes || (proto && !slashedProtocol[proto]))) {
      // there's a hostname.
      // the first instance of /, ?, ;, or # ends the host.
      // don't enforce full RFC correctness, just be unstupid about it.
  
      // If there is an @ in the hostname, then non-host chars *are* allowed
      // to the left of the first @ sign, unless some non-auth character
      // comes *before* the @-sign.
      // URLs are obnoxious.
      var atSign = rest.indexOf('@');
      if (atSign !== -1) {
        // there *may be* an auth
        var hasAuth = true;
        for (var i = 0, l = nonAuthChars.length; i < l; i++) {
          var index = rest.indexOf(nonAuthChars[i]);
          if (index !== -1 && index < atSign) {
            // not a valid auth.  Something like http://foo.com/bar@baz/
            hasAuth = false;
            break;
          }
        }
        if (hasAuth) {
          // pluck off the auth portion.
          out.auth = rest.substr(0, atSign);
          rest = rest.substr(atSign + 1);
        }
      }
  
      var firstNonHost = -1;
      for (var i = 0, l = nonHostChars.length; i < l; i++) {
        var index = rest.indexOf(nonHostChars[i]);
        if (index !== -1 &&
            (firstNonHost < 0 || index < firstNonHost)) firstNonHost = index;
      }
  
      if (firstNonHost !== -1) {
        out.host = rest.substr(0, firstNonHost);
        rest = rest.substr(firstNonHost);
      } else {
        out.host = rest;
        rest = '';
      }
  
      // pull out port.
      var p = parseHost(out.host);
      var keys = Object.keys(p);
      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        out[key] = p[key];
      }
  
      // we've indicated that there is a hostname,
      // so even if it's empty, it has to be present.
      out.hostname = out.hostname || '';
  
      // validate a little.
      if (out.hostname.length > hostnameMaxLen) {
        out.hostname = '';
      } else {
        var hostparts = out.hostname.split(/\./);
        for (var i = 0, l = hostparts.length; i < l; i++) {
          var part = hostparts[i];
          if (!part) continue;
          if (!part.match(hostnamePartPattern)) {
            var newpart = '';
            for (var j = 0, k = part.length; j < k; j++) {
              if (part.charCodeAt(j) > 127) {
                // we replace non-ASCII char with a temporary placeholder
                // we need this to make sure size of hostname is not
                // broken by replacing non-ASCII by nothing
                newpart += 'x';
              } else {
                newpart += part[j];
              }
            }
            // we test again with ASCII char only
            if (!newpart.match(hostnamePartPattern)) {
              var validParts = hostparts.slice(0, i);
              var notHost = hostparts.slice(i + 1);
              var bit = part.match(hostnamePartStart);
              if (bit) {
                validParts.push(bit[1]);
                notHost.unshift(bit[2]);
              }
              if (notHost.length) {
                rest = '/' + notHost.join('.') + rest;
              }
              out.hostname = validParts.join('.');
              break;
            }
          }
        }
      }
  
      // hostnames are always lower case.
      out.hostname = out.hostname.toLowerCase();
  
      out.host = (out.hostname || '') +
          ((out.port) ? ':' + out.port : '');
      out.href += out.host;
    }
  
    // now rest is set to the post-host stuff.
    // chop off any delim chars.
    if (!unsafeProtocol[lowerProto]) {
  
      // First, make 100% sure that any "autoEscape" chars get
      // escaped, even if encodeURIComponent doesn't think they
      // need to be.
      for (var i = 0, l = autoEscape.length; i < l; i++) {
        var ae = autoEscape[i];
        var esc = encodeURIComponent(ae);
        if (esc === ae) {
          esc = escape(ae);
        }
        rest = rest.split(ae).join(esc);
      }
  
      // Now make sure that delims never appear in a url.
      var chop = rest.length;
      for (var i = 0, l = delims.length; i < l; i++) {
        var c = rest.indexOf(delims[i]);
        if (c !== -1) {
          chop = Math.min(c, chop);
        }
      }
      rest = rest.substr(0, chop);
    }
  
  
    // chop off from the tail first.
    var hash = rest.indexOf('#');
    if (hash !== -1) {
      // got a fragment string.
      out.hash = rest.substr(hash);
      rest = rest.slice(0, hash);
    }
    var qm = rest.indexOf('?');
    if (qm !== -1) {
      out.search = rest.substr(qm);
      out.query = rest.substr(qm + 1);
      rest = rest.slice(0, qm);
    } else if (parseQueryString) {
      // no query string, but parseQueryString still requested
      out.search = '';
      out.query = {};
    }
    if (rest) out.pathname = rest;
    if (slashedProtocol[proto] &&
        out.hostname && !out.pathname) {
      out.pathname = '/';
    }
  
    //to support http.request
    if (out.pathname || out.search) {
      out.path = (out.pathname ? out.pathname : '') +
                 (out.search ? out.search : '');
    }
  
    // finally, reconstruct the href based on what has been validated.
    out.href = urlFormat(out);
    return out;
  }
  
  // format a parsed object into a url string
  function urlFormat(obj) {
    // ensure it's an object, and not a string url.
    // If it's an obj, this is a no-op.
    // this way, you can call url_format() on strings
    // to clean up potentially wonky urls.
    if (typeof(obj) === 'string') obj = urlParse(obj);
  
    var auth = obj.auth || '';
    if (auth) {
      auth = auth.split('@').join('%40');
      for (var i = 0, l = nonAuthChars.length; i < l; i++) {
        var nAC = nonAuthChars[i];
        auth = auth.split(nAC).join(encodeURIComponent(nAC));
      }
      auth += '@';
    }
  
    var protocol = obj.protocol || '',
        host = (obj.host !== undefined) ? auth + obj.host :
            obj.hostname !== undefined ? (
                auth + obj.hostname +
                (obj.port ? ':' + obj.port : '')
            ) :
            false,
        pathname = obj.pathname || '',
        query = obj.query || '',
        search = obj.search || (query && ('?' + query)) || '',
        hash = obj.hash || '';
  
    if (protocol && protocol.substr(-1) !== ':') protocol += ':';
  
    // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
    // unless they had them to begin with.
    if (obj.slashes ||
        (!protocol || slashedProtocol[protocol]) && host !== false) {
      host = '//' + (host || '');
      if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
    } else if (!host) {
      host = '';
    }
  
    if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
    if (search && search.charAt(0) !== '?') search = '?' + search;
  
    return protocol + host + pathname + search + hash;
  }
  
  function urlResolve(source, relative) {
    return urlFormat(urlResolveObject(source, relative));
  }
  
  function urlResolveObject(source, relative) {
    if (!source) return relative;
  
    source = urlParse(urlFormat(source), false, true);
    relative = urlParse(urlFormat(relative), false, true);
  
    // hash is always overridden, no matter what.
    source.hash = relative.hash;
  
    if (relative.href === '') {
      source.href = urlFormat(source);
      return source;
    }
  
    // hrefs like //foo/bar always cut to the protocol.
    if (relative.slashes && !relative.protocol) {
      relative.protocol = source.protocol;
      //urlParse appends trailing / to urls like http://www.example.com
      if (slashedProtocol[relative.protocol] &&
          relative.hostname && !relative.pathname) {
        relative.path = relative.pathname = '/';
      }
      relative.href = urlFormat(relative);
      return relative;
    }
  
    if (relative.protocol && relative.protocol !== source.protocol) {
      // if it's a known url protocol, then changing
      // the protocol does weird things
      // first, if it's not file:, then we MUST have a host,
      // and if there was a path
      // to begin with, then we MUST have a path.
      // if it is file:, then the host is dropped,
      // because that's known to be hostless.
      // anything else is assumed to be absolute.
      if (!slashedProtocol[relative.protocol]) {
        relative.href = urlFormat(relative);
        return relative;
      }
      source.protocol = relative.protocol;
      if (!relative.host && !hostlessProtocol[relative.protocol]) {
        var relPath = (relative.pathname || '').split('/');
        while (relPath.length && !(relative.host = relPath.shift()));
        if (!relative.host) relative.host = '';
        if (!relative.hostname) relative.hostname = '';
        if (relPath[0] !== '') relPath.unshift('');
        if (relPath.length < 2) relPath.unshift('');
        relative.pathname = relPath.join('/');
      }
      source.pathname = relative.pathname;
      source.search = relative.search;
      source.query = relative.query;
      source.host = relative.host || '';
      source.auth = relative.auth;
      source.hostname = relative.hostname || relative.host;
      source.port = relative.port;
      //to support http.request
      if (source.pathname !== undefined || source.search !== undefined) {
        source.path = (source.pathname ? source.pathname : '') +
                      (source.search ? source.search : '');
      }
      source.slashes = source.slashes || relative.slashes;
      source.href = urlFormat(source);
      return source;
    }
  
    var isSourceAbs = (source.pathname && source.pathname.charAt(0) === '/'),
        isRelAbs = (
            relative.host !== undefined ||
            relative.pathname && relative.pathname.charAt(0) === '/'
        ),
        mustEndAbs = (isRelAbs || isSourceAbs ||
                      (source.host && relative.pathname)),
        removeAllDots = mustEndAbs,
        srcPath = source.pathname && source.pathname.split('/') || [],
        relPath = relative.pathname && relative.pathname.split('/') || [],
        psychotic = source.protocol &&
            !slashedProtocol[source.protocol];
  
    // if the url is a non-slashed url, then relative
    // links like ../.. should be able
    // to crawl up to the hostname, as well.  This is strange.
    // source.protocol has already been set by now.
    // Later on, put the first path part into the host field.
    if (psychotic) {
  
      delete source.hostname;
      delete source.port;
      if (source.host) {
        if (srcPath[0] === '') srcPath[0] = source.host;
        else srcPath.unshift(source.host);
      }
      delete source.host;
      if (relative.protocol) {
        delete relative.hostname;
        delete relative.port;
        if (relative.host) {
          if (relPath[0] === '') relPath[0] = relative.host;
          else relPath.unshift(relative.host);
        }
        delete relative.host;
      }
      mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
    }
  
    if (isRelAbs) {
      // it's absolute.
      source.host = (relative.host || relative.host === '') ?
                        relative.host : source.host;
      source.hostname = (relative.hostname || relative.hostname === '') ?
                        relative.hostname : source.hostname;
      source.search = relative.search;
      source.query = relative.query;
      srcPath = relPath;
      // fall through to the dot-handling below.
    } else if (relPath.length) {
      // it's relative
      // throw away the existing file, and take the new path instead.
      if (!srcPath) srcPath = [];
      srcPath.pop();
      srcPath = srcPath.concat(relPath);
      source.search = relative.search;
      source.query = relative.query;
    } else if ('search' in relative) {
      // just pull out the search.
      // like href='?foo'.
      // Put this after the other two cases because it simplifies the booleans
      if (psychotic) {
        source.hostname = source.host = srcPath.shift();
        //occationaly the auth can get stuck only in host
        //this especialy happens in cases like
        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
        var authInHost = source.host && source.host.indexOf('@') > 0 ?
                         source.host.split('@') : false;
        if (authInHost) {
          source.auth = authInHost.shift();
          source.host = source.hostname = authInHost.shift();
        }
      }
      source.search = relative.search;
      source.query = relative.query;
      //to support http.request
      if (source.pathname !== undefined || source.search !== undefined) {
        source.path = (source.pathname ? source.pathname : '') +
                      (source.search ? source.search : '');
      }
      source.href = urlFormat(source);
      return source;
    }
    if (!srcPath.length) {
      // no path at all.  easy.
      // we've already handled the other stuff above.
      delete source.pathname;
      //to support http.request
      if (!source.search) {
        source.path = '/' + source.search;
      } else {
        delete source.path;
      }
      source.href = urlFormat(source);
      return source;
    }
    // if a url ENDs in . or .., then it must get a trailing slash.
    // however, if it ends in anything else non-slashy,
    // then it must NOT get a trailing slash.
    var last = srcPath.slice(-1)[0];
    var hasTrailingSlash = (
        (source.host || relative.host) && (last === '.' || last === '..') ||
        last === '');
  
    // strip single dots, resolve double dots to parent dir
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = srcPath.length; i >= 0; i--) {
      last = srcPath[i];
      if (last == '.') {
        srcPath.splice(i, 1);
      } else if (last === '..') {
        srcPath.splice(i, 1);
        up++;
      } else if (up) {
        srcPath.splice(i, 1);
        up--;
      }
    }
  
    // if the path is allowed to go above the root, restore leading ..s
    if (!mustEndAbs && !removeAllDots) {
      for (; up--; up) {
        srcPath.unshift('..');
      }
    }
  
    if (mustEndAbs && srcPath[0] !== '' &&
        (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
      srcPath.unshift('');
    }
  
    if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
      srcPath.push('');
    }
  
    var isAbsolute = srcPath[0] === '' ||
        (srcPath[0] && srcPath[0].charAt(0) === '/');
  
    // put the host back
    if (psychotic) {
      source.hostname = source.host = isAbsolute ? '' :
                                      srcPath.length ? srcPath.shift() : '';
      //occationaly the auth can get stuck only in host
      //this especialy happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = source.host && source.host.indexOf('@') > 0 ?
                       source.host.split('@') : false;
      if (authInHost) {
        source.auth = authInHost.shift();
        source.host = source.hostname = authInHost.shift();
      }
    }
  
    mustEndAbs = mustEndAbs || (source.host && srcPath.length);
  
    if (mustEndAbs && !isAbsolute) {
      srcPath.unshift('');
    }
  
    source.pathname = srcPath.join('/');
    //to support request.http
    if (source.pathname !== undefined || source.search !== undefined) {
      source.path = (source.pathname ? source.pathname : '') +
                    (source.search ? source.search : '');
    }
    source.auth = relative.auth || source.auth;
    source.slashes = source.slashes || relative.slashes;
    source.href = urlFormat(source);
    return source;
  }
  
  function parseHost(host) {
    var out = {};
    var port = portPattern.exec(host);
    if (port) {
      port = port[0];
      out.port = port.substr(1);
      host = host.substr(0, host.length - port.length);
    }
    if (host) out.hostname = host;
    return out;
  }
  

  provide("xmlrpc/lturl", module.exports);
  provide("xmlrpc/lturl", module.exports);
  $.ender(module.exports);
}(global));

// ender:xmlrpc/lxmlrpc-builder.js as xmlrpc/lxmlrpc-builder.js
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  var xmlBuilder    = require('xmlbuilder')
    , dateFormatter =  require('xmlrpc/ldate-formatter.js')
  
  var xmlrpcBuilder = exports
  
  /**
   * Creates the XML for an XML-RPC method call.
   *
   * @param {String} method     - The method name.
   * @param {Array} params      - Params to pass in the call.
   * @param {Function} callback - function (error, xml) { ... }
   *   - {Object|null} error    - Any errors that occurred while building the XML,
   *                              otherwise null.
   *   - {String} xml           - The method call XML.
   */
  xmlrpcBuilder.buildMethodCall = function(method, params, callback) {
  
    // Creates the boiler plate for the XML-RPC call
  var xml = xmlBuilder.create()
    .begin('methodCall', { version: '1.0' })
    .ele('methodName')
      .txt(method)
    .up()
  
    // Adds each parameter to the XML-RPC call
    params = params || []
    var paramsXml = xml.ele('params')
    for (var i = 0; i < params.length; i++) {
      var paramXml = paramsXml.ele('param')
      serializeParam(params[i], paramXml)
    }
  
    // Includes the <?xml ...> declaration
    var xmlString = xml.doc().toString()
    callback(null, xmlString)
  }
  
  /**
   * Creates the XML for an XML-RPC method response.
   *
   * @param {mixed} value       - The value to pass in the response.
   * @param {Function} callback - function (error, xml) { ... }
   *   - {Object|null} error    - Any errors that occurred while building the XML,
   *                              otherwise null.
   *   - {String} xml           - The method response XML.
   */
  xmlrpcBuilder.buildMethodResponse = function(value, callback) {
    // Creates the boiler plate for the XML-RPC response
    var xml = xmlBuilder.create()
      .begin('methodResponse', { version: '1.0' })
  
    // Adds the parameter to the XML-RPC call
    var paramXml = xml.ele('params')
      .ele('param')
    serializeParam(value, paramXml)
  
    // Includes the <?xml ...> declaration
    var xmlString = xml.doc().toString()
    callback(null, xmlString)
  }
  
  xmlrpcBuilder.buildMethodResponseWithAFault = function(fault, callback) {
    // Creates the boiler plate for the XML-RPC response
    var xml = xmlBuilder.create()
      .begin('methodResponse', { version: '1.0' })
  
    // Adds the fault to the XML-RPC call
    var faultXml = xml.ele('fault')
    serializeParam(fault, faultXml)
  
    // Includes the <?xml ...> declaration
    var xmlString = xml.doc().toString()
    callback(null, xmlString)
  }
  
  // Serializes the parameter (and child parameters recursively) to XML
  function serializeParam(param, paramXml) {
  
    // Adds boiler plate for the parameter
    var paramXml = paramXml.ele('value')
  
    switch (typeof param) {
      case 'boolean':
        var logicalValue = param ? 1 : 0
        paramXml.ele('boolean')
          .txt(logicalValue)
        break
  
      case 'string':
        // If the string contains illegal characters, use CDATA
        if (!param.match(/^(?![^<&]*]]>[^<&]*)[^<&]*$/)) {
          paramXml.ele('string')
            .d(param)
        }
        // Force the empty element (<string/>)
        else if (param.length === 0) {
          paramXml.ele('string')
        }
        else {
          paramXml.ele('string')
            .txt(param)
        }
        break
  
      case 'number':
        // Since no is_int or is_float in JavaScript, determines based on if a
        // remainder
        if (param % 1 == 0) {
          paramXml.ele('int')
            .txt(param)
        }
        else {
          paramXml.ele('double')
            .txt(param)
        }
        break
  
      case 'object':
  
        // Uses XML-RPC's nil
        if (param == null) {
          paramXml.ele('nil')
        }
  
        // Uses XML-RPC's date
        else if (param.constructor.name == 'Date') {
          paramXml.ele('dateTime.iso8601')
            .txt(dateFormatter.encodeIso8601(param))
        }
  
        // Uses XML-RPC's array
        else if (param.constructor.name == 'Array') {
          var arrayXml = paramXml.ele('array')
            .ele('data')
  
          for (var j = 0; j < param.length; j++) {
            serializeParam(param[j], arrayXml)
          }
        }
  
        // Uses XML-RPC's base64
        else if (param.constructor.name == 'Buffer') {
          paramXml.ele('base64')
            .txt(param.toString('base64'))
        }
  
        // Uses XML-RPC's struct
        else if (param.constructor.name == 'Object') {
          var arrayXml = paramXml.ele('struct')
  
          for (var key in param) {
            if (param.hasOwnProperty(key)) {
              var memberXml = arrayXml.ele('member')
              memberXml.ele('name')
                .txt(key)
              serializeParam(param[key], memberXml)
            }
          }
        }
        break
    }
  }
  
  

  provide("xmlrpc/lxmlrpc-builder.js", module.exports);
  provide("xmlrpc/lxmlrpc-builder.js", module.exports);
  $.ender(module.exports);
}(global));

// ender:xmlrpc/lxmlrpc-parser.js as xmlrpc/lxmlrpc-parser.js
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  var sax           = require('sax')
    , dateFormatter =  require('xmlrpc/ldate-formatter.js')
  
  var xmlrpcParser = exports
  
  var parser              = createParser()
    , startMethodCall     = false
    , startMethodResponse = false
    , charStream          = ''
  
  /**
   * Parses an XML-RPC method call.
   *
   * @param {String} xml        - The XML string to parse.
   * @param {Function} callback - function (error, value) { ... }
   *   - {Object|null} error    - Any errors that occurred while parsing,
   *                              otherwise null.
   *   - {Object} method        - The method name.
   *   - {Array} params         - Array containing the passed in parameters.
   */
  xmlrpcParser.parseMethodCall = function(xml, callback) {
  
    parser.onopentag = function(node) {
      // Only parse the methodResponse
      if (node.name === 'METHODCALL') {
        startMethodCall = true
        // Parses the method name
        deserializeMethod(function(error, method) {
          // Ignores whitespace encountered before params
          resetListeners(function() {})
  
          // Parses the params
          deserializeParams(function (error, params) {
            callback(error, method, params)
          })
        })
      }
    }
  
    // If the end of the document was reached and the methodCall tag was never
    // encountered, then the XML is an invalid XML-RPC method call.
    parser.onend = function() {
      if (!startMethodCall) {
        var error = new Error('Invalid method call.')
        callback(error)
      }
    }
  
    parser.onerror = function(error) {
      callback(error)
    }
  
    parser.write(xml)
  }
  
  /**
   * Parses an XML-RPC method response.
   *
   * @param {String} xml        - The XML string to parse.
   * @param {Function} callback - function (error, value) { ... }
   *   - {Object|null} error    - Any errors that occurred while parsing,
   *                              otherwise null.
   *   - {Object} value         - Value returned in the method response
   */
  xmlrpcParser.parseMethodResponse = function(xml, callback) {
  
    parser.onopentag = function(node) {
      // Only parse the methodResponse
      if (node.name === 'METHODRESPONSE') {
        startMethodResponse = true
        deserializeParams(function (fault, params) {
  
          // There should be only one param returned from a methodResponse
          var value = null
          if (params !== undefined
            && params !== null
            && Array.isArray(params)
            && params.length > 0) {
            value = params[0]
          }
  
          // Ensure that the error that was passed is an Error instance.
          var error = null
          if (fault !== null) {
            error = new Error(fault.faultString)
            error.code = error.faultCode = fault.faultCode
            error.faultString = fault.faultString
          }
  
          callback(error, value)
        })
      }
    }
  
    parser.onend = function() {
      // If the end of the document was reached and the methodResponse tag was
      // never encountered, then the XML is an invalid XML-RPC method response.
      if (!startMethodResponse) {
        var error = new Error('Invalid method response.')
        callback(error)
      }
    }
  
    parser.onerror = function(error) {
      callback(error)
    }
  
    parser.write(xml)
  }
  
  /**
   * Passes more XML chunks to parse.
   *
   * @param {String} xml - The XML string to parse.
   */
  xmlrpcParser.write = function(xml) {
    parser.write(xml)
  }
  
  /**
   * Let's the parser know it has received all the XML. This must be called.
   */
  xmlrpcParser.close = function() {
    parser.close()
    parser = createParser()
  }
  
  function createParser() {
    startMethodCall = false
    startMethodResponse = false
    return sax.parser()
  }
  
  function resetListeners(startElementListener) {
    // Removes listeners to prevent them from being fired on parsing events when
    // they should be ignored.
  
    // Make sure the right new element handler is listening
    parser.onopentag = startElementListener
  
    // Ignore whitespace in between tags
    parser.ontext = function(chars) { }
  
    // Ignore close tag events
    parser.onclosetag = function(element) { }
  }
  
  function deserializeMethod(callback) {
    parser.onopentag = function(node) {
      if (node.name === 'METHODNAME') {
        parser.ontext = function(chars) {
          charStream += chars
        }
  
        parser.onclosetag = function(element) {
          var methodName = charStream;
          charStream = ''
          callback(null, methodName)
        }
      }
    }
  }
  
  function deserializeParams(callback) {
    var fault  = null
      , params = []
  
    // Returns either a fault object or an array of params when finished parsing
    parser.onend = function() {
      if (fault !== null) {
        callback(fault, null)
      }
      else {
        callback(null, params)
      }
    }
  
    var handleStartElement = function(node) {
      // Parses each param in the message
      if (node.name === 'PARAM') {
        deserializeParam(function (error, param) {
          // Ignores whitespacing and sets correct new element listener
          resetListeners(handleStartElement)
          params.push(param)
        })
      }
      // If the message response is a fault, parse the error
      else if (node.name === 'FAULT') {
        fault = {}
        deserializeParam(function (error, value) {
          resetListeners(handleStartElement)
          fault = value
        })
      }
    }
  
    resetListeners(handleStartElement)
  }
  
  function deserializeParam(callback) {
  
    parser.onopentag = function(node) {
      // Checks if element is an XML-RPC data type
      var flatParams  = ['BOOLEAN', 'DATETIME.ISO8601', 'DOUBLE', 'INT', 'I4', 'I8', 'STRING', 'NIL', 'BASE64']
        , isFlatParam = ~flatParams.indexOf(node.name);
  
      // A non-nested parameter. These simple values can be returned immediately.
      if (isFlatParam) {
        parser.ontext = function(chars) {
          // Stream the additional data to the text stream
          charStream += chars
        }
  
        parser.onclosetag = function(element) {
          var text = charStream
          charStream = ''
  
          // Parses the XML string into the appropriate JavaScript value
          var param = null
          switch (element) {
            case 'BOOLEAN':
              if (text === '1') {
                param = true
              }
              else {
                param = false
              }
              break
            case 'DATETIME.ISO8601':
              param = dateFormatter.decodeIso8601(text)
              break
            case 'DOUBLE':
              param = parseFloat(text)
              break
            case 'I8':
              param = parseFloat(text)
              break
            case 'I4':
              param = parseInt(text)
              break
            case 'INT':
              param = parseInt(text)
              break
            case 'STRING':
              param = text
              break
            case 'BASE64':
              param = new Buffer(text, 'base64')
              break
          }
  
          callback(null, param)
        }
      }
      // An Array must handle multiple values and possibly nested values too
      else if (node.name === 'ARRAY') {
        deserializeArrayParam(function (error, param) {
          callback(null, param)
        })
      }
      // A Struct must handle multiple values and possibly nested values too
      else if (node.name === 'STRUCT') {
        deserializeStructParam(function (error, param) {
          callback(null, param)
        })
      }
      // Probably a <value> without type, like: <value>string</value>
      else {
        // Reset the charstream to prevent whitespace being added to
        // value-elements without an explicit type.
        charStream =''
        parser.ontext = function(chars) {
          // Stream the additional data to the text stream
          charStream += chars
        }
  
        parser.onclosetag = function(element) {
          var param = charStream
          charStream = ''
          callback(null, param);
        }
      }
    }
    
    // The above else code is duplicated here. This is necessary
    // because it is possible to arive here either from a <PARAM>
    // tag or directly from a <VALUE> tag. The latter happens with
    // <ARRAY> and <STRUCT>.
    charStream =''
    parser.ontext = function(chars) {
      charStream += chars
    }
  
    parser.onclosetag = function(element) {
      var param = charStream
      charStream = ''
      callback(null, param);
    }
  
  }
  
  function deserializeArrayParam(callback) {
    var values = []
  
    var checkForArray = function(element) {
      if (element === 'ARRAY') {
        callback(null, values)
      }
    }
  
    var handleStartElement = function(node) {
      // <array>s have a single mandatory <data> tag inside of them. If this is
      // the <data> tag, then set a listener checking for </array>
      if (node.name === 'DATA') {
        parser.onclosetag = checkForArray
      }
      // Parse each element in the array XML (denoted by element 'value') and adds
      // to the array
      else if (node.name === 'VALUE') {
        deserializeParam(function(error, value) {
          // Ignores whitespacing and sets correct new element listener
          resetListeners(handleStartElement)
          values.push(value)
  
          // If hits the end of this array XML, return the values
          parser.onclosetag = checkForArray
        })
      }
    }
  
    parser.onopentag = handleStartElement
  }
  
  function deserializeStructParam(callback) {
    var struct = {}
      , name = null
  
    var handleStartElement = function(node) {
      // Parse each member in the struct XML (denoted by element 'member') and
      // adds to the object
      if (node.name === 'NAME') {
        parser.ontext = function(chars) {
          name = chars
        }
        parser.onclosetag = function(element) {
          resetListeners(handleStartElement)
        }
      }
      if (node.name === 'VALUE') {
        deserializeParam(function(error, value) {
          // Ignores whitespacing and sets correct new element listener
          resetListeners(handleStartElement)
  
          // If hits the end of this struct XML, return the object
          struct[name] = value
          parser.onclosetag = function(element) {
            if (element === 'STRUCT') {
              callback(null, struct)
            }
          }
        })
      }
    }
  
    parser.onopentag = handleStartElement
  }
  
  

  provide("xmlrpc/lxmlrpc-parser.js", module.exports);
  provide("xmlrpc/lxmlrpc-parser.js", module.exports);
  $.ender(module.exports);
}(global));

// ender:xmlrpc/lclient as xmlrpc/lclient
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  var ahr2          = require('ahr2')
    //, http          = require('http')
    //, https         = require('https')
    , url           =  require('xmlrpc/lturl')
    , xmlrpcBuilder =  require('xmlrpc/lxmlrpc-builder.js')
    , xmlrpcParser  =  require('xmlrpc/lxmlrpc-parser.js')
  
  // The node.js core modules have been replaced to make the client independent
  // on node.js:
  // - 'http' and 'https' are substituted with 'ahr2'. All unit tests pass.
  // - 'url' is substituted with 'turl'. This is a copy of node.js's 'url'
  //   without punycode support.
  
  /**
   * Creates a Client object for making XML-RPC method calls.
   *
   * @constructor
   * @param {Object|String} options - Server options to make the HTTP request to.
   *                                  Either a URI string
   *                                  (e.g. 'http://localhost:9090') or an object
   *                                  with fields:
   *   - {String} host              - (optional)
   *   - {Number} port
   * @param {Boolean} isSecure      - True if using https for making calls,
   *                                  otherwise false.
   * @return {Client}
   */
  function Client(options, isSecure) {
  
    // Invokes with new if called without
    if (false === (this instanceof Client)) {
      return new Client(options, isSecure)
    }
  
    // If a string URI is passed in, converts to URI fields
    if (typeof options === 'string') {
      options = url.parse(options)
      options.host = options.hostname
      options.path = options.pathname
    }
  
    // Set the HTTP request headers
    var headers = {
      'User-Agent'     : 'NodeJS XML-RPC Client'
    , 'Content-Type'   : 'text/xml'
    , 'Accept'         : 'text/xml'
    , 'Accept-Charset' : 'UTF8'
    , 'Connection'     : 'Keep-Alive'
    }
    options.headers = options.headers || {}
  
    if (options.headers.Authorization == null &&
        options.basic_auth != null &&
        options.basic_auth.user != null &&
        options.basic_auth.pass != null) {
      options.headers['Authorization'] = 'Basic ' + new Buffer(options.basic_auth.user + ":" + options.basic_auth.pass).toString('base64')
    }
    
    // The 'http' module defaults to 'localhost' when no host is given.
    // The 'ahr2' module does not, so explicitly do so here.
    if (options['host'] === undefined) {
        options['host'] = 'localhost'
    }
  
    for (var attribute in headers) {
      if (options.headers[attribute] === undefined) {
        options.headers[attribute] = headers[attribute]
      }
    }
  
    options.method = 'POST'
    this.options = options
  
    this.isSecure = (isSecure === true) ? true : false
  }
  
  /**
   * Makes an XML-RPC call to the server specified by the constructor's options.
   *
   * @param {String} method     - The method name.
   * @param {Array} params      - Params to send in the call.
   * @param {Function} callback - function(error, value) { ... }
   *   - {Object|null} error    - Any errors when making the call, otherwise null.
   *   - {mixed} value          - The value returned in the method response.
   */
  Client.prototype.methodCall = function(method, params, callback) {
    var that = this
  
    // Creates the XML to send
    xmlrpcBuilder.buildMethodCall(method, params, function(error, xml) {
  
      that.options.headers['Content-Length'] = xml.length
  
      // Uses HTTPS to send request if specified
      //var httpRequester = (that.isSecure) ? https : http
  
      // POSTs the XML to the server
      // The 'ahr2' call is based on the 'http' call that was used originally.
      // The original call is kept commented out below because the replacement
      // is not perfect yet.
      ahr2.post(
        "http://" + that.options.host + ":" + that.options.port + that.options.path,
        { },
        xml
      ).when(function (err, ahr, data) {
        if (err !== undefined) {
          callback(err, null)
        } else {
        // For some reason, the node.js version of ahr2 and the browser
        // version (through pakmanager) return different objects.
        var serialized = data;
        // 'string' is required by xmlrpcParser, which is never provided.
        if (typeof(serialized) !== 'string') {
          // On firefox an XML document is returned
          if ('nodeName' in serialized) {
            // http://www.sencha.com/forum/showthread.php?34553-Convert-DOM-XML-Document-to-string
            try {
              // XMLSerializer exists in current Mozilla browsers
              serializer = new XMLSerializer();
              serialized = serializer.serializeToString(data);
            }
            catch (e) {
              // Internet Explorer has a different approach to serializing XML
              serialized = data.xml;
            }
          } else {
            serialized = data.toString();
          }
        } else {
          // Already a string
        }
        xmlrpcParser.parseMethodResponse(serialized, callback)
        // The original call allowed the data to be streamed. This version
        // does not, although ahr2 probably supports it.
        xmlrpcParser.close()
        }
      });
      
      /*
      // The original call.
      var request = httpRequester.request(that.options, function(result) {
        result.setEncoding('utf8')
  
        var hasReceivedData = false
        result.on('data', function(chunk) {
          // The first time data is received, start the parser
          if (!hasReceivedData) {
            hasReceivedData = true
            xmlrpcParser.parseMethodResponse(chunk, callback)
          }
          // Any subsequent data received is fed into the parser
          else {
            xmlrpcParser.write(chunk)
          }
        })
  
        result.on('end', function(chunk) {
          xmlrpcParser.close()
        })
  
        result.on('error', function(error) {
          callback(error, null)
        })
      })
  
      request.on('error', function(error) {
        callback(error, null)
      })
  
      request.write(xml, 'utf8')
      request.end()
      */
    })
  
  }
  
  module.exports = Client
  
  

  provide("xmlrpc/lclient", module.exports);
  provide("xmlrpc/lclient", module.exports);
  $.ender(module.exports);
}(global));

// ender:xmlrpc as xmlrpc
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  var Client =  require('xmlrpc/lclient')
  
  var xmlrpc = exports
  
  /**
   * Creates an XML-RPC client.
   *
   * @param {Object} options - server options to make the HTTP request to
   *   - {String} host
   *   - {Number} port
   * @return {Client}
   * @see Client
   */
  xmlrpc.createClient = function(options) {
    return new Client(options, false)
  }
  
  /**
   * Creates an XML-RPC client that makes calls using HTTPS.
   *
   * @param {Object} options - server options to make the HTTP request to
   *   - {String} host
   *   - {Number} port
   * @return {Client}
   * @see Client
   */
  xmlrpc.createSecureClient = function(options) {
    return new Client(options, true)
  }
  

  provide("xmlrpc", module.exports);
  provide("xmlrpc", module.exports);
  $.ender(module.exports);
}(global));

// ender:sampwebclient as sampwebclient
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  
  /*jslint node: true */
  
  (function () {
      "use strict";
      var xmlrpc, samp;
  
      xmlrpc = require('xmlrpc');
  
      samp = function () {
  
          // Information about the client.
          // TODO: A 'window'-independent way to get the icon url.
          //var baseUrl = window.location.href.toString().replace(new RegExp("[^/]*$"), "");
          this.metadata = {
              "samp.name": "Sample SAMP client",
              "samp.description": "My first SAMP web application",
              //"samp.icon.url": baseUrl + "clientIcon.gif",
              "author.name": "Hugo Buddelmeijer"
          };
  
          // A flag to indicate whether new messages should be requested
          // from the server.
          this.do_callbacks = true;
  
          // A stub demo message handler.
          this.handler_echo = function (senderId, mtype, params) {
              var xx;
              xx = "ECHO" + " " + senderId + " " + mtype + " " + params;
              console.log(xx);
          };
  
          // MTypes that the client accepts.
          // TODO: Implement support for the MType options map.
          this.subscriptions = {
              "samp.app.ping": this.handler_echo
          };
  
          // Internal counter for send messages. Used to link responses to
          // the right message.
          this.counterMsgTag = 0;
  
          // General message dispatcher.
          this.handleMessages = function (messages) {
              var i,  message, methodName, senderId, mtype, params, handler, response, messageId, responderId;
              console.log("Number of messages: " + messages.length);
              // Can this be done without a for loop?
              for (i = 0; i < messages.length; i += 1) {
                  message = messages[i];
                  console.log(message);
                  methodName = message["samp.methodName"];
                  switch (methodName) {
                  case "receiveCall":
                      senderId = message["samp.params"][0];
                      messageId = message["samp.params"][1];
                      mtype = message["samp.params"][2]["samp.mtype"];
                      params = message["samp.params"][2]["samp.params"];
                      handler = this.subscriptions[mtype];
                      response = handler(senderId, mtype, params);
                      this.reply(messageId, response);
                      break;
                  case "receiveResponse":
                      responderId = message["samp.params"][0];
                      messageId = message["samp.params"][1];
                      mtype = message["samp.params"][1]["samp.mtype"];
                      // TODO: do something with result
                      break;
                  case "receiveNotification":
                      senderId = message["samp.params"][0];
                      mtype = message["samp.params"][1]["samp.mtype"];
                      params = message["samp.params"][1]["samp.params"];
                      handler = this.subscriptions[mtype];
                      response = handler(senderId, mtype, params);
                      break;
                  }
              }
              // TODO: Could this cause problems with recursion depth?
              this.callback();
          };
  
          this.callback = function () {
              console.log("Doing a callback.");
              if (this.do_callbacks) {
                  var handlerfunction = this.handleMessages.bind(this);
                  this.xmlRpcServer.methodCall(
                      'samp.webhub.pullCallbacks',
                      [this.secret, "10"],
                      function (error, value) {
                          if (error !== null) {
                              // TODO: Proper error handling.
                              console.log("Error in callback:" + error);
                              this.callback();
                          } else {
                              handlerfunction(value);
                          }
                      }.bind(this)
                  );
              }
          };
  
          this.connect = function () {
  
              this.xmlRpcServer = xmlrpc.createClient({
                  host: 'localhost',
                  port: 21012,
                  path: '/'
              });
  
              this.xmlRpcServer.methodCall(
                  'samp.webhub.register',
                  [{"samp.name": this.metadata["samp.name"]}],
                  function (error, value) {
                      // TODO: Error handling.
                      this.hubinfo = value;
                      this.secret = this.hubinfo["samp.private-key"];
                      this.declareMetadata();
                      this.allowReverseCallbacks();
                  }.bind(this)
              );
  
          };
  
          this.declareMetadata = function () {
              this.xmlRpcServer.methodCall(
                  'samp.webhub.registerMetadata',
                  [this.secret, this.metadata],
                  function (error, value) {}
              );
          };
  
          this.allowReverseCallbacks = function () {
              this.xmlRpcServer.methodCall(
                  'samp.webhub.allowReverseCallbacks',
                  [this.secret, "1"],
                  function (error, value) {
                      this.declareSubscriptions();
                  }.bind(this)
              );
          };
  
          this.declareSubscriptions = function () {
              var mtype, tempsubscriptions = {};
              for (mtype in this.subscriptions) {
                  if (this.subscriptions.hasOwnProperty(mtype)) {
                      tempsubscriptions[mtype] = {};
                  }
              }
              console.log("declaring subscriptions");
              this.xmlRpcServer.methodCall(
                  'samp.webhub.declareSubscriptions',
                  [this.secret, tempsubscriptions],
                  function (error, value) {
                      this.callback();
                  }.bind(this)
              );
          };
  
          this.disconnect = function () {
              this.do_callbacks = false;
              this.xmlRpcServer.methodCall(
                  'samp.webhub.unregister',
                  [this.secret],
                  function (error, value) {}
              );
          };
  
          this.callall = function (message) {
              this.counterMsgTag += 1;
              // TODO: store messages etc.
              this.xmlRpcServer.samp_webhub_callAll(
                  this.secret,
                  this.counterMsgTag,
                  message
              );
          };
  
          this.reply = function (messageId, response) {
              this.xmlRpcServer.samp_webhub_callAll(
                  this.secret,
                  messageId,
                  response
              );
          };
      };
      module.exports = samp;
  }());
  
  // TODO: Do something below, or rely on pakmanager?
  //var exports = exports || {};
  //exports.samp = samp;
  

  provide("sampwebclient", module.exports);
  provide("sampwebclient", module.exports);
  $.ender(module.exports);
}(global));