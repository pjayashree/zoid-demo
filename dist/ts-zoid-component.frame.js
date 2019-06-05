!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define("trustedseller", [], factory) : "object" == typeof exports ? exports.trustedseller = factory() : root.trustedseller = factory();
}("undefined" != typeof self ? self : this, function() {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: !1,
                exports: {}
            };
            return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
            module.l = !0, module.exports;
        }
        return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
        __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                enumerable: !0,
                get: getter
            });
        }, __webpack_require__.r = function(exports) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(exports, "__esModule", {
                value: !0
            });
        }, __webpack_require__.t = function(value, mode) {
            if (1 & mode && (value = __webpack_require__(value)), 8 & mode) return value;
            if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
            var ns = Object.create(null);
            if (__webpack_require__.r(ns), Object.defineProperty(ns, "default", {
                enumerable: !0,
                value: value
            }), 2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
                return value[key];
            }.bind(null, key));
            return ns;
        }, __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function() {
                return module.default;
            } : function() {
                return module;
            };
            return __webpack_require__.d(getter, "a", getter), getter;
        }, __webpack_require__.o = function(object, property) {
            return {}.hasOwnProperty.call(object, property);
        }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 10);
    }([ function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        function isRegex(item) {
            return "[object RegExp]" === {}.toString.call(item);
        }
        var PROTOCOL = {
            MOCK: "mock:",
            FILE: "file:",
            ABOUT: "about:"
        }, WILDCARD = "*", WINDOW_TYPE = {
            IFRAME: "iframe",
            POPUP: "popup"
        }, IE_WIN_ACCESS_ERROR = "Call was rejected by callee.\r\n";
        function isAboutProtocol(win) {
            return void 0 === win && (win = window), win.location.protocol === PROTOCOL.ABOUT;
        }
        function getParent(win) {
            if (void 0 === win && (win = window), win) try {
                if (win.parent && win.parent !== win) return win.parent;
            } catch (err) {}
        }
        function getOpener(win) {
            if (void 0 === win && (win = window), win && !getParent(win)) try {
                return win.opener;
            } catch (err) {}
        }
        function canReadFromWindow(win) {
            try {
                return !0;
            } catch (err) {}
            return !1;
        }
        function getActualDomain(win) {
            var location = (win = win || window).location;
            if (!location) throw new Error("Can not read window location");
            var protocol = location.protocol;
            if (!protocol) throw new Error("Can not read window protocol");
            if (protocol === PROTOCOL.FILE) return PROTOCOL.FILE + "//";
            if (protocol === PROTOCOL.ABOUT) {
                var parent = getParent(win);
                return parent && canReadFromWindow() ? getActualDomain(parent) : PROTOCOL.ABOUT + "//";
            }
            var host = location.host;
            if (!host) throw new Error("Can not read window host");
            return protocol + "//" + host;
        }
        function getDomain(win) {
            var domain = getActualDomain(win = win || window);
            return domain && win.mockDomain && 0 === win.mockDomain.indexOf(PROTOCOL.MOCK) ? win.mockDomain : domain;
        }
        function isBlankDomain(win) {
            try {
                if (!win.location.href) return !0;
                if ("about:blank" === win.location.href) return !0;
            } catch (err) {}
            return !1;
        }
        function isActuallySameDomain(win) {
            try {
                if (win === window) return !0;
            } catch (err) {}
            try {
                var desc = Object.getOwnPropertyDescriptor(win, "location");
                if (desc && !1 === desc.enumerable) return !1;
            } catch (err) {}
            try {
                if (isAboutProtocol(win) && canReadFromWindow()) return !0;
            } catch (err) {}
            try {
                if (getActualDomain(win) === getActualDomain(window)) return !0;
            } catch (err) {}
            return !1;
        }
        function isSameDomain(win) {
            if (!isActuallySameDomain(win)) return !1;
            try {
                if (win === window) return !0;
                if (isAboutProtocol(win) && canReadFromWindow()) return !0;
                if (getDomain(window) === getDomain(win)) return !0;
            } catch (err) {}
            return !1;
        }
        function assertSameDomain(win) {
            if (!isSameDomain(win)) throw new Error("Expected window to be same domain");
            return win;
        }
        function isAncestorParent(parent, child) {
            if (!parent || !child) return !1;
            var childParent = getParent(child);
            return childParent ? childParent === parent : -1 !== function(win) {
                var result = [];
                try {
                    for (;win.parent !== win; ) result.push(win.parent), win = win.parent;
                } catch (err) {}
                return result;
            }(child).indexOf(parent);
        }
        function getFrames(win) {
            var frames, len, result = [];
            try {
                frames = win.frames;
            } catch (err) {
                frames = win;
            }
            try {
                len = frames.length;
            } catch (err) {}
            if (0 === len) return result;
            if (len) {
                for (var i = 0; i < len; i++) {
                    var frame = void 0;
                    try {
                        frame = frames[i];
                    } catch (err) {
                        continue;
                    }
                    result.push(frame);
                }
                return result;
            }
            for (var _i = 0; _i < 100; _i++) {
                var _frame = void 0;
                try {
                    _frame = frames[_i];
                } catch (err) {
                    return result;
                }
                if (!_frame) return result;
                result.push(_frame);
            }
            return result;
        }
        function getAllChildFrames(win) {
            for (var result = [], _i3 = 0, _getFrames2 = getFrames(win); _i3 < _getFrames2.length; _i3++) {
                var frame = _getFrames2[_i3];
                result.push(frame);
                for (var _i5 = 0, _getAllChildFrames2 = getAllChildFrames(frame); _i5 < _getAllChildFrames2.length; _i5++) result.push(_getAllChildFrames2[_i5]);
            }
            return result;
        }
        function getTop(win) {
            if (win) {
                try {
                    if (win.top) return win.top;
                } catch (err) {}
                if (getParent(win) === win) return win;
                try {
                    if (isAncestorParent(window, win) && window.top) return window.top;
                } catch (err) {}
                try {
                    if (isAncestorParent(win, window) && window.top) return window.top;
                } catch (err) {}
                for (var _i7 = 0, _getAllChildFrames4 = getAllChildFrames(win); _i7 < _getAllChildFrames4.length; _i7++) {
                    var frame = _getAllChildFrames4[_i7];
                    try {
                        if (frame.top) return frame.top;
                    } catch (err) {}
                    if (getParent(frame) === frame) return frame;
                }
            }
        }
        function getAllFramesInWindow(win) {
            var top = getTop(win);
            if (!top) throw new Error("Can not determine top window");
            return [].concat(getAllChildFrames(top), [ top ]);
        }
        function isTop(win) {
            return win === getTop(win);
        }
        var iframeWindows = [], iframeFrames = [];
        function isWindowClosed(win, allowMock) {
            void 0 === allowMock && (allowMock = !0);
            try {
                if (win === window) return !1;
            } catch (err) {
                return !0;
            }
            try {
                if (!win) return !0;
            } catch (err) {
                return !0;
            }
            try {
                if (win.closed) return !0;
            } catch (err) {
                return !err || err.message !== IE_WIN_ACCESS_ERROR;
            }
            if (allowMock && isSameDomain(win)) try {
                if (win.mockclosed) return !0;
            } catch (err) {}
            try {
                if (!win.parent || !win.top) return !0;
            } catch (err) {}
            var iframeIndex = function(collection, item) {
                for (var i = 0; i < collection.length; i++) try {
                    if (collection[i] === item) return i;
                } catch (err) {}
                return -1;
            }(iframeWindows, win);
            if (-1 !== iframeIndex) {
                var frame = iframeFrames[iframeIndex];
                if (frame && function(frame) {
                    if (!frame.contentWindow) return !0;
                    if (!frame.parentNode) return !0;
                    var doc = frame.ownerDocument;
                    return !(!doc || !doc.documentElement || doc.documentElement.contains(frame));
                }(frame)) return !0;
            }
            return !1;
        }
        function linkFrameWindow(frame) {
            if (function() {
                for (var i = 0; i < iframeWindows.length; i++) {
                    var closed = !1;
                    try {
                        closed = iframeWindows[i].closed;
                    } catch (err) {}
                    closed && (iframeFrames.splice(i, 1), iframeWindows.splice(i, 1));
                }
            }(), frame && frame.contentWindow) try {
                iframeWindows.push(frame.contentWindow), iframeFrames.push(frame);
            } catch (err) {}
        }
        function getUserAgent(win) {
            return (win = win || window).navigator.mockUserAgent || win.navigator.userAgent;
        }
        function getFrameByName(win, name) {
            for (var winFrames = getFrames(win), _i9 = 0; _i9 < winFrames.length; _i9++) {
                var childFrame = winFrames[_i9];
                try {
                    if (isSameDomain(childFrame) && childFrame.name === name && -1 !== winFrames.indexOf(childFrame)) return childFrame;
                } catch (err) {}
            }
            try {
                if (-1 !== winFrames.indexOf(win.frames[name])) return win.frames[name];
            } catch (err) {}
            try {
                if (-1 !== winFrames.indexOf(win[name])) return win[name];
            } catch (err) {}
        }
        function isOpener(parent, child) {
            return parent === getOpener(child);
        }
        function getAncestor(win) {
            return void 0 === win && (win = window), getOpener(win = win || window) || getParent(win) || void 0;
        }
        function isAncestor(parent, child) {
            var actualParent = getAncestor(child);
            if (actualParent) return actualParent === parent;
            if (child === parent) return !1;
            if (getTop(child) === child) return !1;
            for (var _i15 = 0, _getFrames8 = getFrames(parent); _i15 < _getFrames8.length; _i15++) if (_getFrames8[_i15] === child) return !0;
            return !1;
        }
        function anyMatch(collection1, collection2) {
            for (var _i17 = 0; _i17 < collection1.length; _i17++) for (var item1 = collection1[_i17], _i19 = 0; _i19 < collection2.length; _i19++) if (item1 === collection2[_i19]) return !0;
            return !1;
        }
        function getDistanceFromTop(win) {
            void 0 === win && (win = window);
            for (var distance = 0, parent = win; parent; ) (parent = getParent(parent)) && (distance += 1);
            return distance;
        }
        function getNthParentFromTop(win, n) {
            return void 0 === n && (n = 1), function(win, n) {
                void 0 === n && (n = 1);
                for (var parent = win, i = 0; i < n; i++) {
                    if (!parent) return;
                    parent = getParent(parent);
                }
                return parent;
            }(win, getDistanceFromTop(win) - n);
        }
        function isSameTopWindow(win1, win2) {
            var top1 = getTop(win1) || win1, top2 = getTop(win2) || win2;
            try {
                if (top1 && top2) return top1 === top2;
            } catch (err) {}
            var allFrames1 = getAllFramesInWindow(win1), allFrames2 = getAllFramesInWindow(win2);
            if (anyMatch(allFrames1, allFrames2)) return !0;
            var opener1 = getOpener(top1), opener2 = getOpener(top2);
            return !(opener1 && anyMatch(getAllFramesInWindow(opener1), allFrames2) || (opener2 && anyMatch(getAllFramesInWindow(opener2), allFrames1), 
            1));
        }
        function matchDomain(pattern, origin) {
            if ("string" == typeof pattern) {
                if ("string" == typeof origin) return pattern === WILDCARD || origin === pattern;
                if (isRegex(origin)) return !1;
                if (Array.isArray(origin)) return !1;
            }
            return isRegex(pattern) ? isRegex(origin) ? pattern.toString() === origin.toString() : !Array.isArray(origin) && Boolean(origin.match(pattern)) : !!Array.isArray(pattern) && (Array.isArray(origin) ? JSON.stringify(pattern) === JSON.stringify(origin) : !isRegex(origin) && pattern.some(function(subpattern) {
                return matchDomain(subpattern, origin);
            }));
        }
        function stringifyDomainPattern(pattern) {
            return Array.isArray(pattern) ? "(" + pattern.join(" | ") + ")" : isRegex(pattern) ? "RegExp(" + pattern.toString() : pattern.toString();
        }
        function getDomainFromUrl(url) {
            return url.match(/^(https?|mock|file):\/\//) ? url.split("/").slice(0, 3).join("/") : getDomain();
        }
        function onCloseWindow(win, callback, delay, maxtime) {
            var timeout;
            return void 0 === delay && (delay = 1e3), void 0 === maxtime && (maxtime = 1 / 0), 
            function check() {
                if (isWindowClosed(win)) return timeout && clearTimeout(timeout), callback();
                maxtime <= 0 ? clearTimeout(timeout) : (maxtime -= delay, timeout = setTimeout(check, delay));
            }(), {
                cancel: function() {
                    timeout && clearTimeout(timeout);
                }
            };
        }
        function isWindow(obj) {
            try {
                if (obj === window) return !0;
            } catch (err) {
                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
            }
            try {
                if ("[object Window]" === {}.toString.call(obj)) return !0;
            } catch (err) {
                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
            }
            try {
                if (window.Window && obj instanceof window.Window) return !0;
            } catch (err) {
                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
            }
            try {
                if (obj && obj.self === obj) return !0;
            } catch (err) {
                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
            }
            try {
                if (obj && obj.parent === obj) return !0;
            } catch (err) {
                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
            }
            try {
                if (obj && obj.top === obj) return !0;
            } catch (err) {
                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
            }
            try {
                if (obj && "__unlikely_value__" === obj.__cross_domain_utils_window_check__) return !1;
            } catch (err) {
                return !0;
            }
            return !1;
        }
        function normalizeMockUrl(url) {
            if (0 !== getDomainFromUrl(url).indexOf(PROTOCOL.MOCK)) return url;
            throw new Error("Mock urls not supported out of test mode");
        }
        __webpack_require__.d(__webpack_exports__, "l", function() {
            return getParent;
        }), __webpack_require__.d(__webpack_exports__, "k", function() {
            return getOpener;
        }), __webpack_require__.d(__webpack_exports__, "c", function() {
            return getActualDomain;
        }), __webpack_require__.d(__webpack_exports__, "g", function() {
            return getDomain;
        }), __webpack_require__.d(__webpack_exports__, "q", function() {
            return isBlankDomain;
        }), __webpack_require__.d(__webpack_exports__, "o", function() {
            return isActuallySameDomain;
        }), __webpack_require__.d(__webpack_exports__, "s", function() {
            return isSameDomain;
        }), __webpack_require__.d(__webpack_exports__, "b", function() {
            return assertSameDomain;
        }), __webpack_require__.d(__webpack_exports__, "m", function() {
            return getTop;
        }), __webpack_require__.d(__webpack_exports__, "d", function() {
            return getAllFramesInWindow;
        }), __webpack_require__.d(__webpack_exports__, "u", function() {
            return isTop;
        }), __webpack_require__.d(__webpack_exports__, "w", function() {
            return isWindowClosed;
        }), __webpack_require__.d(__webpack_exports__, "x", function() {
            return linkFrameWindow;
        }), __webpack_require__.d(__webpack_exports__, "n", function() {
            return getUserAgent;
        }), __webpack_require__.d(__webpack_exports__, "i", function() {
            return getFrameByName;
        }), __webpack_require__.d(__webpack_exports__, "r", function() {
            return isOpener;
        }), __webpack_require__.d(__webpack_exports__, "e", function() {
            return getAncestor;
        }), __webpack_require__.d(__webpack_exports__, "p", function() {
            return isAncestor;
        }), __webpack_require__.d(__webpack_exports__, "f", function() {
            return getDistanceFromTop;
        }), __webpack_require__.d(__webpack_exports__, "j", function() {
            return getNthParentFromTop;
        }), __webpack_require__.d(__webpack_exports__, "t", function() {
            return isSameTopWindow;
        }), __webpack_require__.d(__webpack_exports__, "y", function() {
            return matchDomain;
        }), __webpack_require__.d(__webpack_exports__, "B", function() {
            return stringifyDomainPattern;
        }), __webpack_require__.d(__webpack_exports__, "h", function() {
            return getDomainFromUrl;
        }), __webpack_require__.d(__webpack_exports__, "A", function() {
            return onCloseWindow;
        }), __webpack_require__.d(__webpack_exports__, "v", function() {
            return isWindow;
        }), __webpack_require__.d(__webpack_exports__, "z", function() {
            return normalizeMockUrl;
        }), __webpack_require__.d(__webpack_exports__, "a", function() {
            return WINDOW_TYPE;
        });
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        var objectIDs, esm_extends = __webpack_require__(5), src = __webpack_require__(2), cross_domain_utils_src = __webpack_require__(0), cross_domain_safe_weakmap_src = __webpack_require__(8);
        function base64encode(str) {
            if ("function" == typeof btoa) return btoa(str);
            if ("undefined" != typeof Buffer) return Buffer.from(str, "utf8").toString("base64");
            throw new Error("Can not find window.btoa or Buffer");
        }
        function base64decode(str) {
            if ("undefined" != typeof window && "function" == typeof window.atob) return window.atob(str);
            if ("undefined" != typeof Buffer) return Buffer.from(str, "base64").toString("utf8");
            throw new Error("Can not find window.atob or Buffer");
        }
        function uniqueID() {
            var chars = "0123456789abcdef";
            return "xxxxxxxxxx".replace(/./g, function() {
                return chars.charAt(Math.floor(Math.random() * chars.length));
            }) + "_" + base64encode(new Date().toISOString().slice(11, 19).replace("T", ".")).replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        }
        function serializeArgs(args) {
            try {
                return JSON.stringify([].slice.call(args), function(subkey, val) {
                    return "function" == typeof val ? "memoize[" + function(obj) {
                        if (objectIDs = objectIDs || new cross_domain_safe_weakmap_src.a(), null == obj || "object" != typeof obj && "function" != typeof obj) throw new Error("Invalid object");
                        var uid = objectIDs.get(obj);
                        return uid || (uid = typeof obj + ":" + uniqueID(), objectIDs.set(obj, uid)), uid;
                    }(val) + "]" : val;
                });
            } catch (err) {
                throw new Error("Arguments not serializable -- can not be used to memoize");
            }
        }
        function memoize(method, options) {
            var _this = this;
            void 0 === options && (options = {});
            var cacheMap = new cross_domain_safe_weakmap_src.a();
            function memoizedFunction() {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                var cache = cacheMap.getOrSet(options.thisNamespace ? this : method, function() {
                    return {};
                }), key = serializeArgs(args), cacheTime = options.time;
                if (cache[key] && cacheTime && Date.now() - cache[key].time < cacheTime && delete cache[key], 
                cache[key]) return cache[key].value;
                var time = Date.now(), value = method.apply(this, arguments);
                return cache[key] = {
                    time: time,
                    value: value
                }, cache[key].value;
            }
            return memoizedFunction.reset = function() {
                cacheMap.delete(options.thisNamespace ? _this : method);
            }, options.name && (memoizedFunction.displayName = options.name + ":memoized"), 
            memoizedFunction;
        }
        function memoizePromise(method) {
            var cache = {};
            function memoizedPromiseFunction() {
                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
                var key = serializeArgs(args);
                return cache.hasOwnProperty(key) ? cache[key] : (cache[key] = method.apply(this, arguments).finally(function() {
                    delete cache[key];
                }), cache[key]);
            }
            return memoizedPromiseFunction.reset = function() {
                cache = {};
            }, memoizedPromiseFunction;
        }
        function inlineMemoize(method, logic, args) {
            void 0 === args && (args = []);
            var cache = method.__inline_memoize_cache__ = method.__inline_memoize_cache__ || {}, key = serializeArgs(args);
            return cache.hasOwnProperty(key) ? cache[key] : cache[key] = logic.apply(void 0, args);
        }
        function noop() {}
        function once(method) {
            var called = !1;
            return function() {
                if (!called) return called = !0, method.apply(this, arguments);
            };
        }
        function stringifyError(err, level) {
            if (void 0 === level && (level = 1), level >= 3) return "stringifyError stack overflow";
            try {
                if (!err) return "<unknown error: " + {}.toString.call(err) + ">";
                if ("string" == typeof err) return err;
                if (err instanceof Error) {
                    var stack = err && err.stack, message = err && err.message;
                    if (stack && message) return -1 !== stack.indexOf(message) ? stack : message + "\n" + stack;
                    if (stack) return stack;
                    if (message) return message;
                }
                return "function" == typeof err.toString ? err.toString() : {}.toString.call(err);
            } catch (newErr) {
                return "Error while stringifying error: " + stringifyError(newErr, level + 1);
            }
        }
        function stringify(item) {
            return "string" == typeof item ? item : item && "function" == typeof item.toString ? item.toString() : {}.toString.call(item);
        }
        function extend(obj, source) {
            if (!source) return obj;
            if (Object.assign) return Object.assign(obj, source);
            for (var key in source) source.hasOwnProperty(key) && (obj[key] = source[key]);
            return obj;
        }
        function values(obj) {
            var result = [];
            for (var key in obj) obj.hasOwnProperty(key) && result.push(obj[key]);
            return result;
        }
        function safeInterval(method, time) {
            var timeout;
            return function loop() {
                timeout = setTimeout(function() {
                    method(), loop();
                }, time);
            }(), {
                cancel: function() {
                    clearTimeout(timeout);
                }
            };
        }
        function dotify(obj, prefix, newobj) {
            for (var key in void 0 === prefix && (prefix = ""), void 0 === newobj && (newobj = {}), 
            prefix = prefix ? prefix + "." : prefix, obj) obj.hasOwnProperty(key) && null != obj[key] && "function" != typeof obj[key] && (obj[key] && Array.isArray(obj[key]) && obj[key].length && obj[key].every(function(val) {
                return "object" != typeof val;
            }) ? newobj["" + prefix + key + "[]"] = obj[key].join(",") : obj[key] && "object" == typeof obj[key] ? newobj = dotify(obj[key], "" + prefix + key, newobj) : newobj["" + prefix + key] = obj[key].toString());
            return newobj;
        }
        function arrayFrom(item) {
            return [].slice.call(item);
        }
        function isDefined(value) {
            return null != value;
        }
        function isRegex(item) {
            return "[object RegExp]" === {}.toString.call(item);
        }
        var awaitFrameLoadPromises, util_weakMapMemoize = function(method) {
            var weakmap = new cross_domain_safe_weakmap_src.a();
            return function(arg) {
                var _this4 = this;
                return weakmap.getOrSet(arg, function() {
                    return method.call(_this4, arg);
                });
            };
        }, util_weakMapMemoizePromise = function(method) {
            var weakmap = new cross_domain_safe_weakmap_src.a();
            return function(arg) {
                var _this5 = this;
                return weakmap.getOrSet(arg, function() {
                    return method.call(_this5, arg).finally(function() {
                        weakmap.delete(arg);
                    });
                });
            };
        };
        function getOrSet(obj, key, getter) {
            if (obj.hasOwnProperty(key)) return obj[key];
            var val = getter();
            return obj[key] = val, val;
        }
        function cleanup(obj) {
            var tasks = [], cleaned = !1;
            return {
                set: function(name, item) {
                    return cleaned || (obj[name] = item, this.register(function() {
                        delete obj[name];
                    })), item;
                },
                register: function(method) {
                    cleaned ? method() : tasks.push(once(method));
                },
                all: function() {
                    var results = [];
                    for (cleaned = !0; tasks.length; ) {
                        var task = tasks.pop();
                        results.push(task());
                    }
                    return src.a.all(results).then(noop);
                }
            };
        }
        function isDocumentReady() {
            return Boolean(document.body) && "complete" === document.readyState;
        }
        function urlEncode(str) {
            return str.replace(/\?/g, "%3F").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2B");
        }
        function waitForDocumentReady() {
            return inlineMemoize(waitForDocumentReady, function() {
                return new src.a(function(resolve) {
                    if (isDocumentReady()) return resolve();
                    var interval = setInterval(function() {
                        if (isDocumentReady()) return clearInterval(interval), resolve();
                    }, 10);
                });
            });
        }
        function waitForDocumentBody() {
            return waitForDocumentReady().then(function() {
                if (document.body) return document.body;
                throw new Error("Document ready but document.body not present");
            });
        }
        function parseQuery(queryString) {
            return inlineMemoize(parseQuery, function() {
                var params = {};
                if (!queryString) return params;
                if (-1 === queryString.indexOf("=")) return params;
                for (var _i2 = 0, _queryString$split2 = queryString.split("&"); _i2 < _queryString$split2.length; _i2++) {
                    var pair = _queryString$split2[_i2];
                    (pair = pair.split("="))[0] && pair[1] && (params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]));
                }
                return params;
            }, [ queryString ]);
        }
        function extendQuery(originalQuery, props) {
            return void 0 === props && (props = {}), props && Object.keys(props).length ? (void 0 === (obj = Object(esm_extends.a)({}, parseQuery(originalQuery), props)) && (obj = {}), 
            Object.keys(obj).filter(function(key) {
                return "string" == typeof obj[key];
            }).map(function(key) {
                return urlEncode(key) + "=" + urlEncode(obj[key]);
            }).join("&")) : originalQuery;
            var obj;
        }
        function extendUrl(url, options) {
            void 0 === options && (options = {});
            var originalUrl, originalHash, query = options.query || {}, hash = options.hash || {}, _url$split = url.split("#");
            originalHash = _url$split[1];
            var _originalUrl$split = (originalUrl = _url$split[0]).split("?");
            originalUrl = _originalUrl$split[0];
            var queryString = extendQuery(_originalUrl$split[1], query), hashString = extendQuery(originalHash, hash);
            return queryString && (originalUrl = originalUrl + "?" + queryString), hashString && (originalUrl = originalUrl + "#" + hashString), 
            originalUrl;
        }
        function appendChild(container, child) {
            container.appendChild(child);
        }
        function isElement(element) {
            return element instanceof window.Element || null !== element && "object" == typeof element && 1 === element.nodeType && "object" == typeof element.style && "object" == typeof element.ownerDocument;
        }
        function getElementSafe(id, doc) {
            return void 0 === doc && (doc = document), isElement(id) ? id : "string" == typeof id ? doc.querySelector(id) : void 0;
        }
        function elementReady(id) {
            return new src.a(function(resolve, reject) {
                var name = stringify(id), el = getElementSafe(id);
                if (el) return resolve(el);
                if (isDocumentReady()) return reject(new Error("Document is ready and element " + name + " does not exist"));
                var interval = setInterval(function() {
                    return (el = getElementSafe(id)) ? (clearInterval(interval), resolve(el)) : isDocumentReady() ? (clearInterval(interval), 
                    reject(new Error("Document is ready and element " + name + " does not exist"))) : void 0;
                }, 10);
            });
        }
        function PopupOpenError(message) {
            this.message = message;
        }
        function popup(url, options) {
            var width = (options = options || {}).width, height = options.height, top = 0, left = 0;
            width && (window.outerWidth ? left = Math.round((window.outerWidth - width) / 2) + window.screenX : window.screen.width && (left = Math.round((window.screen.width - width) / 2))), 
            height && (window.outerHeight ? top = Math.round((window.outerHeight - height) / 2) + window.screenY : window.screen.height && (top = Math.round((window.screen.height - height) / 2)));
            var name = (options = Object(esm_extends.a)({
                top: top,
                left: left,
                width: width,
                height: height,
                status: 1,
                toolbar: 0,
                menubar: 0,
                resizable: 1,
                scrollbars: 1
            }, options)).name || "";
            delete options.name;
            var win, err, params = Object.keys(options).map(function(key) {
                if (options[key]) return key + "=" + stringify(options[key]);
            }).filter(Boolean).join(",");
            try {
                win = window.open(url, name, params, !0);
            } catch (err) {
                throw new PopupOpenError("Can not open popup window - " + (err.stack || err.message));
            }
            if (Object(cross_domain_utils_src.w)(win)) throw new PopupOpenError("Can not open popup window - blocked");
            return window.addEventListener("unload", function() {
                return win.close();
            }), win;
        }
        function writeElementToWindow(win, el) {
            var tag = el.tagName.toLowerCase();
            if ("html" !== tag) throw new Error("Expected element to be html, got " + tag);
            for (var documentElement = win.document.documentElement, _i6 = 0, _arrayFrom2 = arrayFrom(documentElement.children); _i6 < _arrayFrom2.length; _i6++) documentElement.removeChild(_arrayFrom2[_i6]);
            for (var _i8 = 0, _arrayFrom4 = arrayFrom(el.children); _i8 < _arrayFrom4.length; _i8++) documentElement.appendChild(_arrayFrom4[_i8]);
        }
        function awaitFrameLoad(frame) {
            if ((awaitFrameLoadPromises = awaitFrameLoadPromises || new cross_domain_safe_weakmap_src.a()).has(frame)) {
                var _promise = awaitFrameLoadPromises.get(frame);
                if (_promise) return _promise;
            }
            var promise = new src.a(function(resolve, reject) {
                frame.addEventListener("load", function() {
                    Object(cross_domain_utils_src.x)(frame), resolve(frame);
                }), frame.addEventListener("error", function(err) {
                    frame.contentWindow ? resolve(frame) : reject(err);
                });
            });
            return awaitFrameLoadPromises.set(frame, promise), promise;
        }
        function awaitFrameWindow(frame) {
            return awaitFrameLoad(frame).then(function(loadedFrame) {
                if (!loadedFrame.contentWindow) throw new Error("Could not find window in iframe");
                return loadedFrame.contentWindow;
            });
        }
        function createElement(tag, options, container) {
            void 0 === tag && (tag = "div"), void 0 === options && (options = {}), tag = tag.toLowerCase();
            var el, styleText, doc, element = document.createElement(tag);
            if (options.style && extend(element.style, options.style), options.class && (element.className = options.class.join(" ")), 
            options.id && element.setAttribute("id", options.id), options.attributes) for (var _i10 = 0, _Object$keys2 = Object.keys(options.attributes); _i10 < _Object$keys2.length; _i10++) {
                var key = _Object$keys2[_i10];
                element.setAttribute(key, options.attributes[key]);
            }
            if (options.styleSheet && (el = element, styleText = options.styleSheet, void 0 === doc && (doc = window.document), 
            el.styleSheet ? el.styleSheet.cssText = styleText : el.appendChild(doc.createTextNode(styleText))), 
            container && appendChild(container, element), options.html) if ("iframe" === tag) {
                if (!container || !element.contentWindow) throw new Error("Iframe html can not be written unless container provided and iframe in DOM");
                !function(win, html) {
                    try {
                        win.document.open(), win.document.write(html), win.document.close();
                    } catch (err) {
                        try {
                            win.location = "javascript: document.open(); document.write(" + JSON.stringify(html) + "); document.close();";
                        } catch (err2) {}
                    }
                }(element.contentWindow, options.html);
            } else element.innerHTML = options.html;
            return element;
        }
        function iframe(options, container) {
            void 0 === options && (options = {});
            var attributes = options.attributes || {}, style = options.style || {}, frame = createElement("iframe", {
                attributes: Object(esm_extends.a)({
                    allowTransparency: "true"
                }, attributes),
                style: Object(esm_extends.a)({
                    backgroundColor: "transparent",
                    border: "none"
                }, style),
                html: options.html,
                class: options.class
            }), isIE = window.navigator.userAgent.match(/MSIE|Edge/i);
            return frame.hasAttribute("id") || frame.setAttribute("id", uniqueID()), awaitFrameLoad(frame), 
            container && function(id, doc) {
                void 0 === doc && (doc = document);
                var element = getElementSafe(id, doc);
                if (element) return element;
                throw new Error("Can not find element: " + stringify(id));
            }(container).appendChild(frame), (options.url || isIE) && frame.setAttribute("src", options.url || "about:blank"), 
            frame;
        }
        function addEventListener(obj, event, handler) {
            return obj.addEventListener(event, handler), {
                cancel: function() {
                    obj.removeEventListener(event, handler);
                }
            };
        }
        function destroyElement(element) {
            element && element.parentNode && element.parentNode.removeChild(element);
        }
        function addClass(element, name) {
            element.classList.add(name);
        }
        function removeClass(element, name) {
            element.classList.remove(name);
        }
        function isElementClosed(el) {
            return !el || !el.parentNode;
        }
        function watchElementForClose(element, handler) {
            var interval;
            return handler = once(handler), isElementClosed(element) ? handler() : interval = safeInterval(function() {
                isElementClosed(element) && (interval.cancel(), handler());
            }, 50), {
                cancel: function() {
                    interval && interval.cancel();
                }
            };
        }
        function onResize(el, handler, _temp) {
            var _ref2 = void 0 === _temp ? {} : _temp, _ref2$width = _ref2.width, width = void 0 === _ref2$width || _ref2$width, _ref2$height = _ref2.height, height = void 0 === _ref2$height || _ref2$height, _ref2$interval = _ref2.interval, interval = void 0 === _ref2$interval ? 100 : _ref2$interval, _ref2$win = _ref2.win, win = void 0 === _ref2$win ? window : _ref2$win, currentWidth = el.offsetWidth, currentHeight = el.offsetHeight;
            handler({
                width: currentWidth,
                height: currentHeight
            });
            var observer, timeout, check = function() {
                var newWidth = el.offsetWidth, newHeight = el.offsetHeight;
                (width && newWidth !== currentWidth || height && newHeight !== currentHeight) && handler({
                    width: newWidth,
                    height: newHeight
                }), currentWidth = newWidth, currentHeight = newHeight;
            };
            return void 0 !== win.ResizeObserver ? (observer = new win.ResizeObserver(check)).observe(el) : void 0 !== win.MutationObserver ? ((observer = new win.MutationObserver(check)).observe(el, {
                attributes: !0,
                childList: !0,
                subtree: !0,
                characterData: !1
            }), win.addEventListener("resize", check)) : function loop() {
                check(), timeout = setTimeout(loop, interval);
            }(), {
                cancel: function() {
                    observer.disconnect(), window.removeEventListener("resize", check), clearTimeout(timeout);
                }
            };
        }
        function memoized(target, name, descriptor) {
            descriptor.value = memoize(descriptor.value, {
                name: name,
                thisNamespace: !0
            });
        }
        function isPerc(str) {
            return "string" == typeof str && /^[0-9]+%$/.test(str);
        }
        function isPx(str) {
            return "string" == typeof str && /^[0-9]+px$/.test(str);
        }
        function toNum(val) {
            if ("number" == typeof val) return val;
            var match = val.match(/^([0-9]+)(px|%)$/);
            if (!match) throw new Error("Could not match css value from " + val);
            return parseInt(match[1], 10);
        }
        function toPx(val) {
            return toNum(val) + "px";
        }
        function toCSS(val) {
            return "number" == typeof val ? toPx(val) : isPerc(val) ? val : toPx(val);
        }
        function normalizeDimension(dim, max) {
            if ("number" == typeof dim) return dim;
            if (isPerc(dim)) return parseInt(max * toNum(dim) / 100, 10);
            if (isPx(dim)) return toNum(dim);
            throw new Error("Can not normalize dimension: " + dim);
        }
        PopupOpenError.prototype = Object.create(Error.prototype), __webpack_require__.d(__webpack_exports__, "J", function() {
            return waitForDocumentBody;
        }), __webpack_require__.d(__webpack_exports__, "m", function() {
            return extendUrl;
        }), __webpack_require__.d(__webpack_exports__, "c", function() {
            return appendChild;
        }), __webpack_require__.d(__webpack_exports__, "r", function() {
            return isElement;
        }), __webpack_require__.d(__webpack_exports__, "n", function() {
            return getElementSafe;
        }), __webpack_require__.d(__webpack_exports__, "k", function() {
            return elementReady;
        }), __webpack_require__.d(__webpack_exports__, "C", function() {
            return popup;
        }), __webpack_require__.d(__webpack_exports__, "N", function() {
            return writeElementToWindow;
        }), __webpack_require__.d(__webpack_exports__, "d", function() {
            return awaitFrameWindow;
        }), __webpack_require__.d(__webpack_exports__, "h", function() {
            return createElement;
        }), __webpack_require__.d(__webpack_exports__, "p", function() {
            return iframe;
        }), __webpack_require__.d(__webpack_exports__, "b", function() {
            return addEventListener;
        }), __webpack_require__.d(__webpack_exports__, "i", function() {
            return destroyElement;
        }), __webpack_require__.d(__webpack_exports__, "a", function() {
            return addClass;
        }), __webpack_require__.d(__webpack_exports__, "D", function() {
            return removeClass;
        }), __webpack_require__.d(__webpack_exports__, "K", function() {
            return watchElementForClose;
        }), __webpack_require__.d(__webpack_exports__, "A", function() {
            return onResize;
        }), __webpack_require__.d(__webpack_exports__, "f", function() {
            return base64encode;
        }), __webpack_require__.d(__webpack_exports__, "e", function() {
            return base64decode;
        }), __webpack_require__.d(__webpack_exports__, "H", function() {
            return uniqueID;
        }), __webpack_require__.d(__webpack_exports__, "v", function() {
            return memoize;
        }), __webpack_require__.d(__webpack_exports__, "w", function() {
            return memoizePromise;
        }), __webpack_require__.d(__webpack_exports__, "y", function() {
            return noop;
        }), __webpack_require__.d(__webpack_exports__, "B", function() {
            return once;
        }), __webpack_require__.d(__webpack_exports__, "F", function() {
            return stringifyError;
        }), __webpack_require__.d(__webpack_exports__, "l", function() {
            return extend;
        }), __webpack_require__.d(__webpack_exports__, "I", function() {
            return values;
        }), __webpack_require__.d(__webpack_exports__, "E", function() {
            return safeInterval;
        }), __webpack_require__.d(__webpack_exports__, "j", function() {
            return dotify;
        }), __webpack_require__.d(__webpack_exports__, "q", function() {
            return isDefined;
        }), __webpack_require__.d(__webpack_exports__, "u", function() {
            return isRegex;
        }), __webpack_require__.d(__webpack_exports__, "L", function() {
            return util_weakMapMemoize;
        }), __webpack_require__.d(__webpack_exports__, "M", function() {
            return util_weakMapMemoizePromise;
        }), __webpack_require__.d(__webpack_exports__, "o", function() {
            return getOrSet;
        }), __webpack_require__.d(__webpack_exports__, "g", function() {
            return cleanup;
        }), __webpack_require__.d(__webpack_exports__, "x", function() {
            return memoized;
        }), __webpack_require__.d(__webpack_exports__, "s", function() {
            return isPerc;
        }), __webpack_require__.d(__webpack_exports__, "t", function() {
            return isPx;
        }), __webpack_require__.d(__webpack_exports__, "G", function() {
            return toCSS;
        }), __webpack_require__.d(__webpack_exports__, "z", function() {
            return normalizeDimension;
        });
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        function utils_isPromise(item) {
            try {
                if (!item) return !1;
                if ("undefined" != typeof Promise && item instanceof Promise) return !0;
                if ("undefined" != typeof window && window.Window && item instanceof window.Window) return !1;
                if ("undefined" != typeof window && window.constructor && item instanceof window.constructor) return !1;
                var _toString = {}.toString;
                if (_toString) {
                    var name = _toString.call(item);
                    if ("[object Window]" === name || "[object global]" === name || "[object DOMWindow]" === name) return !1;
                }
                if ("function" == typeof item.then) return !0;
            } catch (err) {
                return !1;
            }
            return !1;
        }
        var flushPromise, dispatchedErrors = [], possiblyUnhandledPromiseHandlers = [], activeCount = 0;
        function flushActive() {
            if (!activeCount && flushPromise) {
                var promise = flushPromise;
                flushPromise = null, promise.resolve();
            }
        }
        function startActive() {
            activeCount += 1;
        }
        function endActive() {
            activeCount -= 1, flushActive();
        }
        var promise_ZalgoPromise = function() {
            function ZalgoPromise(handler) {
                var _this = this;
                if (this.resolved = void 0, this.rejected = void 0, this.errorHandled = void 0, 
                this.value = void 0, this.error = void 0, this.handlers = void 0, this.dispatching = void 0, 
                this.stack = void 0, this.resolved = !1, this.rejected = !1, this.errorHandled = !1, 
                this.handlers = [], handler) {
                    var _result, _error, resolved = !1, rejected = !1, isAsync = !1;
                    startActive();
                    try {
                        handler(function(res) {
                            isAsync ? _this.resolve(res) : (resolved = !0, _result = res);
                        }, function(err) {
                            isAsync ? _this.reject(err) : (rejected = !0, _error = err);
                        });
                    } catch (err) {
                        return endActive(), void this.reject(err);
                    }
                    endActive(), isAsync = !0, resolved ? this.resolve(_result) : rejected && this.reject(_error);
                }
            }
            var _proto = ZalgoPromise.prototype;
            return _proto.resolve = function(result) {
                if (this.resolved || this.rejected) return this;
                if (utils_isPromise(result)) throw new Error("Can not resolve promise with another promise");
                return this.resolved = !0, this.value = result, this.dispatch(), this;
            }, _proto.reject = function(error) {
                var _this2 = this;
                if (this.resolved || this.rejected) return this;
                if (utils_isPromise(error)) throw new Error("Can not reject promise with another promise");
                if (!error) {
                    var _err = error && "function" == typeof error.toString ? error.toString() : {}.toString.call(error);
                    error = new Error("Expected reject to be called with Error, got " + _err);
                }
                return this.rejected = !0, this.error = error, this.errorHandled || setTimeout(function() {
                    _this2.errorHandled || function(err, promise) {
                        if (-1 === dispatchedErrors.indexOf(err)) {
                            dispatchedErrors.push(err), setTimeout(function() {
                                throw err;
                            }, 1);
                            for (var j = 0; j < possiblyUnhandledPromiseHandlers.length; j++) possiblyUnhandledPromiseHandlers[j](err, promise);
                        }
                    }(error, _this2);
                }, 1), this.dispatch(), this;
            }, _proto.asyncReject = function(error) {
                return this.errorHandled = !0, this.reject(error), this;
            }, _proto.dispatch = function() {
                var _this3 = this, resolved = this.resolved, rejected = this.rejected, handlers = this.handlers;
                if (!this.dispatching && (resolved || rejected)) {
                    this.dispatching = !0, startActive();
                    for (var _loop = function(i) {
                        var _handlers$i = handlers[i], onSuccess = _handlers$i.onSuccess, onError = _handlers$i.onError, promise = _handlers$i.promise, result = void 0;
                        if (resolved) try {
                            result = onSuccess ? onSuccess(_this3.value) : _this3.value;
                        } catch (err) {
                            return promise.reject(err), "continue";
                        } else if (rejected) {
                            if (!onError) return promise.reject(_this3.error), "continue";
                            try {
                                result = onError(_this3.error);
                            } catch (err) {
                                return promise.reject(err), "continue";
                            }
                        }
                        result instanceof ZalgoPromise && (result.resolved || result.rejected) ? (result.resolved ? promise.resolve(result.value) : promise.reject(result.error), 
                        result.errorHandled = !0) : utils_isPromise(result) ? result instanceof ZalgoPromise && (result.resolved || result.rejected) ? result.resolved ? promise.resolve(result.value) : promise.reject(result.error) : result.then(function(res) {
                            promise.resolve(res);
                        }, function(err) {
                            promise.reject(err);
                        }) : promise.resolve(result);
                    }, i = 0; i < handlers.length; i++) _loop(i);
                    handlers.length = 0, this.dispatching = !1, endActive();
                }
            }, _proto.then = function(onSuccess, onError) {
                if (onSuccess && "function" != typeof onSuccess && !onSuccess.call) throw new Error("Promise.then expected a function for success handler");
                if (onError && "function" != typeof onError && !onError.call) throw new Error("Promise.then expected a function for error handler");
                var promise = new ZalgoPromise();
                return this.handlers.push({
                    promise: promise,
                    onSuccess: onSuccess,
                    onError: onError
                }), this.errorHandled = !0, this.dispatch(), promise;
            }, _proto.catch = function(onError) {
                return this.then(void 0, onError);
            }, _proto.finally = function(onFinally) {
                if (onFinally && "function" != typeof onFinally && !onFinally.call) throw new Error("Promise.finally expected a function");
                return this.then(function(result) {
                    return ZalgoPromise.try(onFinally).then(function() {
                        return result;
                    });
                }, function(err) {
                    return ZalgoPromise.try(onFinally).then(function() {
                        throw err;
                    });
                });
            }, _proto.timeout = function(time, err) {
                var _this4 = this;
                if (this.resolved || this.rejected) return this;
                var timeout = setTimeout(function() {
                    _this4.resolved || _this4.rejected || _this4.reject(err || new Error("Promise timed out after " + time + "ms"));
                }, time);
                return this.then(function(result) {
                    return clearTimeout(timeout), result;
                });
            }, _proto.toPromise = function() {
                if ("undefined" == typeof Promise) throw new TypeError("Could not find Promise");
                return Promise.resolve(this);
            }, ZalgoPromise.resolve = function(value) {
                return value instanceof ZalgoPromise ? value : utils_isPromise(value) ? new ZalgoPromise(function(resolve, reject) {
                    return value.then(resolve, reject);
                }) : new ZalgoPromise().resolve(value);
            }, ZalgoPromise.reject = function(error) {
                return new ZalgoPromise().reject(error);
            }, ZalgoPromise.asyncReject = function(error) {
                return new ZalgoPromise().asyncReject(error);
            }, ZalgoPromise.all = function(promises) {
                var promise = new ZalgoPromise(), count = promises.length, results = [];
                if (!count) return promise.resolve(results), promise;
                for (var _loop2 = function(i) {
                    var prom = promises[i];
                    if (prom instanceof ZalgoPromise) {
                        if (prom.resolved) return results[i] = prom.value, count -= 1, "continue";
                    } else if (!utils_isPromise(prom)) return results[i] = prom, count -= 1, "continue";
                    ZalgoPromise.resolve(prom).then(function(result) {
                        results[i] = result, 0 == (count -= 1) && promise.resolve(results);
                    }, function(err) {
                        promise.reject(err);
                    });
                }, i = 0; i < promises.length; i++) _loop2(i);
                return 0 === count && promise.resolve(results), promise;
            }, ZalgoPromise.hash = function(promises) {
                var result = {};
                return ZalgoPromise.all(Object.keys(promises).map(function(key) {
                    return ZalgoPromise.resolve(promises[key]).then(function(value) {
                        result[key] = value;
                    });
                })).then(function() {
                    return result;
                });
            }, ZalgoPromise.map = function(items, method) {
                return ZalgoPromise.all(items.map(method));
            }, ZalgoPromise.onPossiblyUnhandledException = function(handler) {
                return function(handler) {
                    return possiblyUnhandledPromiseHandlers.push(handler), {
                        cancel: function() {
                            possiblyUnhandledPromiseHandlers.splice(possiblyUnhandledPromiseHandlers.indexOf(handler), 1);
                        }
                    };
                }(handler);
            }, ZalgoPromise.try = function(method, context, args) {
                if (method && "function" != typeof method && !method.call) throw new Error("Promise.try expected a function");
                var result;
                startActive();
                try {
                    result = method.apply(context, args || []);
                } catch (err) {
                    return endActive(), ZalgoPromise.reject(err);
                }
                return endActive(), ZalgoPromise.resolve(result);
            }, ZalgoPromise.delay = function(_delay) {
                return new ZalgoPromise(function(resolve) {
                    setTimeout(resolve, _delay);
                });
            }, ZalgoPromise.isPromise = function(value) {
                return !!(value && value instanceof ZalgoPromise) || utils_isPromise(value);
            }, ZalgoPromise.flush = function() {
                return promise = flushPromise = flushPromise || new ZalgoPromise(), flushActive(), 
                promise;
                var promise;
            }, ZalgoPromise;
        }();
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return promise_ZalgoPromise;
        });
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        var _ALLOWED_POST_MESSAGE, MESSAGE_TYPE = {
            REQUEST: "postrobot_message_request",
            RESPONSE: "postrobot_message_response",
            ACK: "postrobot_message_ack"
        }, MESSAGE_ACK = {
            SUCCESS: "success",
            ERROR: "error"
        }, MESSAGE_NAME = {
            METHOD: "postrobot_method",
            HELLO: "postrobot_hello",
            OPEN_TUNNEL: "postrobot_open_tunnel"
        }, WINDOW_PROP = {
            POSTROBOT: "__postRobot__"
        }, SEND_STRATEGY = {
            POST_MESSAGE: "postrobot_post_message",
            BRIDGE: "postrobot_bridge",
            GLOBAL: "postrobot_global"
        }, PROTOCOL = {
            MOCK: "mock:",
            FILE: "file:"
        }, SERIALIZATION_TYPE = {
            CROSS_DOMAIN_ZALGO_PROMISE: "cross_domain_zalgo_promise",
            CROSS_DOMAIN_FUNCTION: "cross_domain_function",
            CROSS_DOMAIN_WINDOW: "cross_domain_window"
        }, CONFIG = {
            BRIDGE_TIMEOUT: 5e3,
            CHILD_WINDOW_TIMEOUT: 5e3,
            ACK_TIMEOUT: 2e3,
            ACK_TIMEOUT_KNOWN: 1e4,
            RES_TIMEOUT: -1,
            ALLOWED_POST_MESSAGE_METHODS: (_ALLOWED_POST_MESSAGE = {}, _ALLOWED_POST_MESSAGE[SEND_STRATEGY.POST_MESSAGE] = !0, 
            _ALLOWED_POST_MESSAGE[SEND_STRATEGY.BRIDGE] = !0, _ALLOWED_POST_MESSAGE[SEND_STRATEGY.GLOBAL] = !0, 
            _ALLOWED_POST_MESSAGE)
        };
        __webpack_require__.d(__webpack_exports__, "b", function() {
            return CONFIG;
        }), __webpack_require__.d(__webpack_exports__, "e", function() {
            return MESSAGE_TYPE;
        }), __webpack_require__.d(__webpack_exports__, "c", function() {
            return MESSAGE_ACK;
        }), __webpack_require__.d(__webpack_exports__, "d", function() {
            return MESSAGE_NAME;
        }), __webpack_require__.d(__webpack_exports__, "j", function() {
            return WINDOW_PROP;
        }), __webpack_require__.d(__webpack_exports__, "g", function() {
            return SEND_STRATEGY;
        }), __webpack_require__.d(__webpack_exports__, "f", function() {
            return PROTOCOL;
        }), __webpack_require__.d(__webpack_exports__, "a", function() {
            return "__postrobot_bridge__";
        }), __webpack_require__.d(__webpack_exports__, "i", function() {
            return "*";
        }), __webpack_require__.d(__webpack_exports__, "h", function() {
            return SERIALIZATION_TYPE;
        });
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return global;
        }), __webpack_require__.d(__webpack_exports__, "c", function() {
            return windowStore;
        }), __webpack_require__.d(__webpack_exports__, "b", function() {
            return globalStore;
        });
        var cross_domain_safe_weakmap_src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8), belter_src__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1), _conf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3), global = window[_conf__WEBPACK_IMPORTED_MODULE_2__.j.POSTROBOT] = window[_conf__WEBPACK_IMPORTED_MODULE_2__.j.POSTROBOT] || {}, winStore = global.windowStore = global.windowStore || new cross_domain_safe_weakmap_src__WEBPACK_IMPORTED_MODULE_0__.a(), getObj = function() {
            return {};
        };
        function windowStore(key, defStore) {
            function getStore(win) {
                return winStore.getOrSet(win, defStore);
            }
            return void 0 === defStore && (defStore = getObj), {
                has: function(win) {
                    return getStore(win).hasOwnProperty(key);
                },
                get: function(win, defVal) {
                    var store = getStore(win);
                    return store.hasOwnProperty(key) ? store[key] : defVal;
                },
                set: function(win, val) {
                    return getStore(win)[key] = val, val;
                },
                del: function(win) {
                    delete getStore(win)[key];
                },
                getOrSet: function(win, getter) {
                    var store = getStore(win);
                    if (store.hasOwnProperty(key)) return store[key];
                    var val = getter();
                    return store[key] = val, val;
                }
            };
        }
        function globalStore(key, defStore) {
            void 0 === defStore && (defStore = getObj);
            var store = Object(belter_src__WEBPACK_IMPORTED_MODULE_1__.o)(global, key, defStore);
            return {
                has: function(storeKey) {
                    return store.hasOwnProperty(storeKey);
                },
                get: function(storeKey, defVal) {
                    return store.hasOwnProperty(storeKey) ? store[storeKey] : defVal;
                },
                set: function(storeKey, val) {
                    return store[storeKey] = val, val;
                },
                del: function(storeKey) {
                    delete store[storeKey];
                },
                getOrSet: function(storeKey, getter) {
                    if (store.hasOwnProperty(storeKey)) return store[storeKey];
                    var val = getter();
                    return store[storeKey] = val, val;
                },
                reset: function() {
                    store = defStore();
                },
                keys: function() {
                    return Object.keys(store);
                }
            };
        }
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        function _extends() {
            return (_extends = Object.assign || function(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) ({}).hasOwnProperty.call(source, key) && (target[key] = source[key]);
                }
                return target;
            }).apply(this, arguments);
        }
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return _extends;
        });
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        var src = __webpack_require__(0), zalgo_promise_src = __webpack_require__(2), belter_src = __webpack_require__(1), conf = __webpack_require__(3), global = __webpack_require__(4);
        global.a.instanceID = global.a.instanceID || Object(belter_src.H)();
        var helloPromises = Object(global.c)("helloPromises");
        function getHelloPromise(win) {
            return helloPromises.getOrSet(win, function() {
                return new zalgo_promise_src.a();
            });
        }
        var listenForHello = Object(belter_src.B)(function() {
            global.a.on(conf.d.HELLO, {
                domain: conf.i
            }, function(_ref) {
                var source = _ref.source, origin = _ref.origin;
                return getHelloPromise(source).resolve({
                    win: source,
                    domain: origin
                }), {
                    instanceID: global.a.instanceID
                };
            });
        });
        function sayHello(win) {
            return global.a.send(win, conf.d.HELLO, {
                instanceID: global.a.instanceID
            }, {
                domain: conf.i,
                timeout: -1
            }).then(function(_ref2) {
                var origin = _ref2.origin, instanceID = _ref2.data.instanceID;
                return getHelloPromise(win).resolve({
                    win: win,
                    domain: origin
                }), {
                    win: win,
                    domain: origin,
                    instanceID: instanceID
                };
            });
        }
        var getWindowInstanceID = Object(belter_src.M)(function(win) {
            return sayHello(win).then(function(_ref3) {
                return _ref3.instanceID;
            });
        });
        function initHello() {
            listenForHello();
            var parent = Object(src.e)();
            parent && sayHello(parent).catch(belter_src.y);
        }
        function awaitWindowHello(win, timeout, name) {
            void 0 === timeout && (timeout = 5e3), void 0 === name && (name = "Window");
            var promise = getHelloPromise(win);
            return -1 !== timeout && (promise = promise.timeout(timeout, new Error(name + " did not load after " + timeout + "ms"))), 
            promise;
        }
        function needsGlobalMessagingForBrowser() {
            return !!Object(src.n)(window).match(/MSIE|rv:11|trident|edge\/12|edge\/13/i);
        }
        var knownWindows = Object(global.c)("knownWindows");
        function markWindowKnown(win) {
            knownWindows.set(win, !0);
        }
        function isWindowKnown(win) {
            return knownWindows.get(win, !1);
        }
        __webpack_require__.d(__webpack_exports__, "g", function() {
            return sayHello;
        }), __webpack_require__.d(__webpack_exports__, "b", function() {
            return getWindowInstanceID;
        }), __webpack_require__.d(__webpack_exports__, "c", function() {
            return initHello;
        }), __webpack_require__.d(__webpack_exports__, "a", function() {
            return awaitWindowHello;
        }), __webpack_require__.d(__webpack_exports__, "f", function() {
            return needsGlobalMessagingForBrowser;
        }), __webpack_require__.d(__webpack_exports__, "e", function() {
            return markWindowKnown;
        }), __webpack_require__.d(__webpack_exports__, "d", function() {
            return isWindowKnown;
        });
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var src = __webpack_require__(0), belter_src = __webpack_require__(1), conf = __webpack_require__(3), global = __webpack_require__(4), tunnelWindows = Object(global.b)("tunnelWindows");
        global.a.openTunnelToParent = function(_ref2) {
            var name = _ref2.name, source = _ref2.source, canary = _ref2.canary, sendMessage = _ref2.sendMessage, parentWindow = Object(src.l)(window);
            if (!parentWindow) throw new Error("No parent window found to open tunnel to");
            var id = function(_ref) {
                var name = _ref.name, source = _ref.source, canary = _ref.canary, sendMessage = _ref.sendMessage;
                !function() {
                    for (var _i2 = 0, _tunnelWindows$keys2 = tunnelWindows.keys(); _i2 < _tunnelWindows$keys2.length; _i2++) {
                        var key = _tunnelWindows$keys2[_i2], tunnelWindow = tunnelWindows[key];
                        try {
                            Object(belter_src.y)(tunnelWindow.source);
                        } catch (err) {
                            tunnelWindows.del(key);
                            continue;
                        }
                        Object(src.w)(tunnelWindow.source) && tunnelWindows.del(key);
                    }
                }();
                var id = Object(belter_src.H)();
                return tunnelWindows.set(id, {
                    name: name,
                    source: source,
                    canary: canary,
                    sendMessage: sendMessage
                }), id;
            }({
                name: name,
                source: source,
                canary: canary,
                sendMessage: sendMessage
            });
            return global.a.send(parentWindow, conf.d.OPEN_TUNNEL, {
                name: name,
                sendMessage: function() {
                    var tunnelWindow = tunnelWindows.get(id);
                    try {
                        Object(belter_src.y)(tunnelWindow && tunnelWindow.source);
                    } catch (err) {
                        return void tunnelWindows.del(id);
                    }
                    if (tunnelWindow && tunnelWindow.source && !Object(src.w)(tunnelWindow.source)) {
                        try {
                            tunnelWindow.canary();
                        } catch (err) {
                            return;
                        }
                        tunnelWindow.sendMessage.apply(this, arguments);
                    }
                }
            }, {
                domain: conf.i
            });
        };
        var zalgo_promise_src = __webpack_require__(2);
        function needsBridgeForBrowser() {
            return !!Object(src.n)(window).match(/MSIE|trident|edge\/12|edge\/13/i);
        }
        function needsBridgeForWin(win) {
            return !Object(src.t)(window, win);
        }
        function needsBridgeForDomain(domain, win) {
            if (domain) {
                if (Object(src.g)() !== Object(src.h)(domain)) return !0;
            } else if (win && !Object(src.s)(win)) return !0;
            return !1;
        }
        function needsBridge(_ref) {
            var win = _ref.win, domain = _ref.domain;
            return !(!needsBridgeForBrowser() || domain && !needsBridgeForDomain(domain, win) || win && !needsBridgeForWin(win));
        }
        function getBridgeName(domain) {
            var sanitizedDomain = (domain = domain || Object(src.h)(domain)).replace(/[^a-zA-Z0-9]+/g, "_");
            return conf.a + "_" + sanitizedDomain;
        }
        function isBridge() {
            return Boolean(window.name && window.name === getBridgeName(Object(src.g)()));
        }
        var documentBodyReady = new zalgo_promise_src.a(function(resolve) {
            if (window.document && window.document.body) return resolve(window.document.body);
            var interval = setInterval(function() {
                if (window.document && window.document.body) return clearInterval(interval), resolve(window.document.body);
            }, 10);
        }), remoteWindows = Object(global.c)("remoteWindows");
        function registerRemoteWindow(win) {
            remoteWindows.getOrSet(win, function() {
                return new zalgo_promise_src.a();
            });
        }
        function findRemoteWindow(win) {
            var remoteWin = remoteWindows.get(win);
            if (!remoteWin) throw new Error("Remote window not found");
            return remoteWin;
        }
        function registerRemoteSendMessage(win, domain, sendMessage) {
            findRemoteWindow(win).resolve(function(remoteWin, remoteDomain, message) {
                if (remoteWin !== win) throw new Error("Remote window does not match window");
                if (!Object(src.y)(remoteDomain, domain)) throw new Error("Remote domain " + remoteDomain + " does not match domain " + domain);
                sendMessage(message);
            });
        }
        function rejectRemoteSendMessage(win, err) {
            findRemoteWindow(win).reject(err).catch(belter_src.y);
        }
        function sendBridgeMessage(win, domain, message) {
            var messagingChild = Object(src.r)(window, win), messagingParent = Object(src.r)(win, window);
            if (!messagingChild && !messagingParent) throw new Error("Can only send messages to and from parent and popup windows");
            return findRemoteWindow(win).then(function(sendMessage) {
                return sendMessage(win, domain, message);
            });
        }
        var awaitRemoteBridgeForWindow = Object(belter_src.L)(function(win) {
            return zalgo_promise_src.a.try(function() {
                try {
                    var frame = Object(src.i)(win, getBridgeName(Object(src.g)()));
                    if (!frame) return;
                    return Object(src.s)(frame) && frame[conf.j.POSTROBOT] ? frame : new zalgo_promise_src.a(function(resolve) {
                        var interval, timeout;
                        interval = setInterval(function() {
                            if (frame && Object(src.s)(frame) && frame[conf.j.POSTROBOT]) return clearInterval(interval), 
                            clearTimeout(timeout), resolve(frame);
                        }, 100), timeout = setTimeout(function() {
                            return clearInterval(interval), resolve();
                        }, 2e3);
                    });
                } catch (err) {}
            });
        });
        function openTunnelToOpener() {
            return zalgo_promise_src.a.try(function() {
                var opener = Object(src.k)(window);
                if (opener && needsBridge({
                    win: opener
                })) return registerRemoteWindow(opener), awaitRemoteBridgeForWindow(opener).then(function(bridge) {
                    return bridge ? window.name ? bridge[conf.j.POSTROBOT].openTunnelToParent({
                        name: window.name,
                        source: window,
                        canary: function() {},
                        sendMessage: function(message) {
                            try {
                                Object(belter_src.y)(window);
                            } catch (err) {
                                return;
                            }
                            if (window && !window.closed) try {
                                global.a.receiveMessage({
                                    data: message,
                                    origin: this.origin,
                                    source: this.source
                                });
                            } catch (err) {
                                zalgo_promise_src.a.reject(err);
                            }
                        }
                    }).then(function(_ref) {
                        var source = _ref.source, origin = _ref.origin, data = _ref.data;
                        if (source !== opener) throw new Error("Source does not match opener");
                        registerRemoteSendMessage(source, origin, data.sendMessage);
                    }).catch(function(err) {
                        throw rejectRemoteSendMessage(opener, err), err;
                    }) : rejectRemoteSendMessage(opener, new Error("Can not register with opener: window does not have a name")) : rejectRemoteSendMessage(opener, new Error("Can not register with opener: no bridge found in opener"));
                });
            });
        }
        var lib = __webpack_require__(6), bridges = Object(global.b)("bridges"), bridgeFrames = Object(global.b)("bridgeFrames"), popupWindowsByName = Object(global.b)("popupWindowsByName"), popupWindowsByWin = Object(global.c)("popupWindowsByWin");
        function hasBridge(url, domain) {
            return bridges.has(domain || Object(src.h)(url));
        }
        function openBridge(url, domain) {
            return domain = domain || Object(src.h)(url), bridges.getOrSet(domain, function() {
                return zalgo_promise_src.a.try(function() {
                    if (Object(src.g)() === domain) throw new Error("Can not open bridge on the same domain as current domain: " + domain);
                    var name = getBridgeName(domain);
                    if (Object(src.i)(window, name)) throw new Error("Frame with name " + name + " already exists on page");
                    var iframe = function(name, url) {
                        var iframe = document.createElement("iframe");
                        return iframe.setAttribute("name", name), iframe.setAttribute("id", name), iframe.setAttribute("style", "display: none; margin: 0; padding: 0; border: 0px none; overflow: hidden;"), 
                        iframe.setAttribute("frameborder", "0"), iframe.setAttribute("border", "0"), iframe.setAttribute("scrolling", "no"), 
                        iframe.setAttribute("allowTransparency", "true"), iframe.setAttribute("tabindex", "-1"), 
                        iframe.setAttribute("hidden", "true"), iframe.setAttribute("title", ""), iframe.setAttribute("role", "presentation"), 
                        iframe.src = url, iframe;
                    }(name, url);
                    return bridgeFrames.set(domain, iframe), documentBodyReady.then(function(body) {
                        body.appendChild(iframe);
                        var bridge = iframe.contentWindow;
                        return function(source, domain) {
                            global.a.on(conf.d.OPEN_TUNNEL, {
                                window: bridge,
                                domain: domain
                            }, function(_ref) {
                                var origin = _ref.origin, data = _ref.data;
                                if (origin !== domain) throw new Error("Domain " + domain + " does not match origin " + origin);
                                if (!data.name) throw new Error("Register window expected to be passed window name");
                                if (!data.sendMessage) throw new Error("Register window expected to be passed sendMessage method");
                                if (!popupWindowsByName.has(data.name)) throw new Error("Window with name " + data.name + " does not exist, or was not opened by this window");
                                if (!popupWindowsByName.get(data.name).domain) throw new Error("We do not have a registered domain for window " + data.name);
                                if (popupWindowsByName.get(data.name).domain !== origin) throw new Error("Message origin " + origin + " does not matched registered window origin " + popupWindowsByName.get(data.name).domain);
                                return registerRemoteSendMessage(popupWindowsByName.get(data.name).win, domain, data.sendMessage), 
                                {
                                    sendMessage: function(message) {
                                        if (window && !window.closed) {
                                            var winDetails = popupWindowsByName.get(data.name);
                                            if (winDetails) try {
                                                global.a.receiveMessage({
                                                    data: message,
                                                    origin: winDetails.domain,
                                                    source: winDetails.win
                                                });
                                            } catch (err) {
                                                zalgo_promise_src.a.reject(err);
                                            }
                                        }
                                    }
                                };
                            });
                        }(0, domain), new zalgo_promise_src.a(function(resolve, reject) {
                            iframe.onload = resolve, iframe.onerror = reject;
                        }).then(function() {
                            return Object(lib.a)(bridge, conf.b.BRIDGE_TIMEOUT, "Bridge " + url);
                        }).then(function() {
                            return bridge;
                        });
                    });
                });
            });
        }
        function linkWindow(_ref2) {
            for (var win = _ref2.win, name = _ref2.name, domain = _ref2.domain, _i2 = 0, _popupWindowsByName$k2 = popupWindowsByName.keys(); _i2 < _popupWindowsByName$k2.length; _i2++) {
                var winName = _popupWindowsByName$k2[_i2];
                Object(src.w)(popupWindowsByName.get(winName).win) && popupWindowsByName.del(winName);
            }
            var details = popupWindowsByWin.getOrSet(win, function() {
                return name ? popupWindowsByName.getOrSet(name, function() {
                    return {
                        win: win,
                        name: name
                    };
                }) : {
                    win: win
                };
            });
            if (details.win && details.win !== win) throw new Error("Different window already linked for window: " + (name || "undefined"));
            if (name) {
                if (details.name && details.name !== name) throw new Error("Different window already linked for name " + name + ": " + details.name);
                details.name = name, popupWindowsByName.set(name, details);
            }
            return domain && (details.domain = domain, registerRemoteWindow(win)), popupWindowsByWin.set(win, details), 
            details;
        }
        function linkUrl(win, url) {
            linkWindow({
                win: win,
                domain: Object(src.h)(url)
            });
        }
        var windowOpen = window.open;
        function destroyBridges() {
            for (var _i4 = 0, _bridgeFrames$keys2 = bridgeFrames.keys(); _i4 < _bridgeFrames$keys2.length; _i4++) {
                var frame = bridgeFrames.get(_bridgeFrames$keys2[_i4]);
                frame && frame.parentNode && frame.parentNode.removeChild(frame);
            }
            bridgeFrames.reset(), bridges.reset();
        }
        window.open = function(url, name, options, last) {
            var win = windowOpen.call(this, Object(src.z)(url), name, options, last);
            return win ? (linkWindow({
                win: win,
                name: name,
                domain: url ? Object(src.h)(url) : null
            }), win) : win;
        }, __webpack_require__.d(__webpack_exports__, "openTunnelToOpener", function() {
            return openTunnelToOpener;
        }), __webpack_require__.d(__webpack_exports__, "needsBridgeForBrowser", function() {
            return needsBridgeForBrowser;
        }), __webpack_require__.d(__webpack_exports__, "needsBridgeForWin", function() {
            return needsBridgeForWin;
        }), __webpack_require__.d(__webpack_exports__, "needsBridgeForDomain", function() {
            return needsBridgeForDomain;
        }), __webpack_require__.d(__webpack_exports__, "needsBridge", function() {
            return needsBridge;
        }), __webpack_require__.d(__webpack_exports__, "getBridgeName", function() {
            return getBridgeName;
        }), __webpack_require__.d(__webpack_exports__, "isBridge", function() {
            return isBridge;
        }), __webpack_require__.d(__webpack_exports__, "documentBodyReady", function() {
            return documentBodyReady;
        }), __webpack_require__.d(__webpack_exports__, "registerRemoteWindow", function() {
            return registerRemoteWindow;
        }), __webpack_require__.d(__webpack_exports__, "findRemoteWindow", function() {
            return findRemoteWindow;
        }), __webpack_require__.d(__webpack_exports__, "registerRemoteSendMessage", function() {
            return registerRemoteSendMessage;
        }), __webpack_require__.d(__webpack_exports__, "rejectRemoteSendMessage", function() {
            return rejectRemoteSendMessage;
        }), __webpack_require__.d(__webpack_exports__, "sendBridgeMessage", function() {
            return sendBridgeMessage;
        }), __webpack_require__.d(__webpack_exports__, "hasBridge", function() {
            return hasBridge;
        }), __webpack_require__.d(__webpack_exports__, "openBridge", function() {
            return openBridge;
        }), __webpack_require__.d(__webpack_exports__, "linkWindow", function() {
            return linkWindow;
        }), __webpack_require__.d(__webpack_exports__, "linkUrl", function() {
            return linkUrl;
        }), __webpack_require__.d(__webpack_exports__, "destroyBridges", function() {
            return destroyBridges;
        });
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        var interface_namespaceObject = {};
        __webpack_require__.r(interface_namespaceObject), __webpack_require__.d(interface_namespaceObject, "WeakMap", function() {
            return weakmap_CrossDomainSafeWeakMap;
        });
        var src = __webpack_require__(0);
        function safeIndexOf(collection, item) {
            for (var i = 0; i < collection.length; i++) try {
                if (collection[i] === item) return i;
            } catch (err) {}
            return -1;
        }
        var defineProperty = Object.defineProperty, counter = Date.now() % 1e9, weakmap_CrossDomainSafeWeakMap = function() {
            function CrossDomainSafeWeakMap() {
                if (this.name = void 0, this.weakmap = void 0, this.keys = void 0, this.values = void 0, 
                counter += 1, this.name = "__weakmap_" + (1e9 * Math.random() >>> 0) + "__" + counter, 
                function() {
                    if ("undefined" == typeof WeakMap) return !1;
                    if (void 0 === Object.freeze) return !1;
                    try {
                        var testWeakMap = new WeakMap(), testKey = {};
                        return Object.freeze(testKey), testWeakMap.set(testKey, "__testvalue__"), "__testvalue__" === testWeakMap.get(testKey);
                    } catch (err) {
                        return !1;
                    }
                }()) try {
                    this.weakmap = new WeakMap();
                } catch (err) {}
                this.keys = [], this.values = [];
            }
            var _proto = CrossDomainSafeWeakMap.prototype;
            return _proto._cleanupClosedWindows = function() {
                for (var weakmap = this.weakmap, keys = this.keys, i = 0; i < keys.length; i++) {
                    var value = keys[i];
                    if (Object(src.v)(value) && Object(src.w)(value)) {
                        if (weakmap) try {
                            weakmap.delete(value);
                        } catch (err) {}
                        keys.splice(i, 1), this.values.splice(i, 1), i -= 1;
                    }
                }
            }, _proto.isSafeToReadWrite = function(key) {
                return !Object(src.v)(key);
            }, _proto.set = function(key, value) {
                if (!key) throw new Error("WeakMap expected key");
                var weakmap = this.weakmap;
                if (weakmap) try {
                    weakmap.set(key, value);
                } catch (err) {
                    delete this.weakmap;
                }
                if (this.isSafeToReadWrite(key)) try {
                    var name = this.name, entry = key[name];
                    return void (entry && entry[0] === key ? entry[1] = value : defineProperty(key, name, {
                        value: [ key, value ],
                        writable: !0
                    }));
                } catch (err) {}
                this._cleanupClosedWindows();
                var keys = this.keys, values = this.values, index = safeIndexOf(keys, key);
                -1 === index ? (keys.push(key), values.push(value)) : values[index] = value;
            }, _proto.get = function(key) {
                if (!key) throw new Error("WeakMap expected key");
                var weakmap = this.weakmap;
                if (weakmap) try {
                    if (weakmap.has(key)) return weakmap.get(key);
                } catch (err) {
                    delete this.weakmap;
                }
                if (this.isSafeToReadWrite(key)) try {
                    var entry = key[this.name];
                    return entry && entry[0] === key ? entry[1] : void 0;
                } catch (err) {}
                this._cleanupClosedWindows();
                var index = safeIndexOf(this.keys, key);
                if (-1 !== index) return this.values[index];
            }, _proto.delete = function(key) {
                if (!key) throw new Error("WeakMap expected key");
                var weakmap = this.weakmap;
                if (weakmap) try {
                    weakmap.delete(key);
                } catch (err) {
                    delete this.weakmap;
                }
                if (this.isSafeToReadWrite(key)) try {
                    var entry = key[this.name];
                    entry && entry[0] === key && (entry[0] = entry[1] = void 0);
                } catch (err) {}
                this._cleanupClosedWindows();
                var keys = this.keys, index = safeIndexOf(keys, key);
                -1 !== index && (keys.splice(index, 1), this.values.splice(index, 1));
            }, _proto.has = function(key) {
                if (!key) throw new Error("WeakMap expected key");
                var weakmap = this.weakmap;
                if (weakmap) try {
                    if (weakmap.has(key)) return !0;
                } catch (err) {
                    delete this.weakmap;
                }
                if (this.isSafeToReadWrite(key)) try {
                    var entry = key[this.name];
                    return !(!entry || entry[0] !== key);
                } catch (err) {}
                return this._cleanupClosedWindows(), -1 !== safeIndexOf(this.keys, key);
            }, _proto.getOrSet = function(key, getter) {
                if (this.has(key)) return this.get(key);
                var value = getter();
                return this.set(key, value), value;
            }, CrossDomainSafeWeakMap;
        }();
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return weakmap_CrossDomainSafeWeakMap;
        });
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
        __webpack_require__.d(__webpack_exports__, "openBridge", function() {
            return _index__WEBPACK_IMPORTED_MODULE_0__.openBridge;
        }), __webpack_require__.d(__webpack_exports__, "linkWindow", function() {
            return _index__WEBPACK_IMPORTED_MODULE_0__.linkWindow;
        }), __webpack_require__.d(__webpack_exports__, "linkUrl", function() {
            return _index__WEBPACK_IMPORTED_MODULE_0__.linkUrl;
        }), __webpack_require__.d(__webpack_exports__, "isBridge", function() {
            return _index__WEBPACK_IMPORTED_MODULE_0__.isBridge;
        }), __webpack_require__.d(__webpack_exports__, "needsBridge", function() {
            return _index__WEBPACK_IMPORTED_MODULE_0__.needsBridge;
        }), __webpack_require__.d(__webpack_exports__, "needsBridgeForBrowser", function() {
            return _index__WEBPACK_IMPORTED_MODULE_0__.needsBridgeForBrowser;
        }), __webpack_require__.d(__webpack_exports__, "hasBridge", function() {
            return _index__WEBPACK_IMPORTED_MODULE_0__.hasBridge;
        }), __webpack_require__.d(__webpack_exports__, "needsBridgeForWin", function() {
            return _index__WEBPACK_IMPORTED_MODULE_0__.needsBridgeForWin;
        }), __webpack_require__.d(__webpack_exports__, "needsBridgeForDomain", function() {
            return _index__WEBPACK_IMPORTED_MODULE_0__.needsBridgeForDomain;
        }), __webpack_require__.d(__webpack_exports__, "openTunnelToOpener", function() {
            return _index__WEBPACK_IMPORTED_MODULE_0__.openTunnelToOpener;
        }), __webpack_require__.d(__webpack_exports__, "destroyBridges", function() {
            return _index__WEBPACK_IMPORTED_MODULE_0__.destroyBridges;
        });
    }, function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var interface_namespaceObject = {};
        __webpack_require__.r(interface_namespaceObject), __webpack_require__.d(interface_namespaceObject, "markWindowKnown", function() {
            return lib.e;
        }), __webpack_require__.d(interface_namespaceObject, "serializeMessage", function() {
            return serializeMessage;
        }), __webpack_require__.d(interface_namespaceObject, "deserializeMessage", function() {
            return deserializeMessage;
        }), __webpack_require__.d(interface_namespaceObject, "ProxyWindow", function() {
            return window_ProxyWindow;
        }), __webpack_require__.d(interface_namespaceObject, "cleanUpWindow", function() {
            return cleanUpWindow;
        }), __webpack_require__.d(interface_namespaceObject, "Promise", function() {
            return zalgo_promise_src.a;
        }), __webpack_require__.d(interface_namespaceObject, "bridge", function() {
            return bridge;
        }), __webpack_require__.d(interface_namespaceObject, "parent", function() {
            return public_parent;
        }), __webpack_require__.d(interface_namespaceObject, "requestPromises", function() {
            return requestPromises;
        }), __webpack_require__.d(interface_namespaceObject, "request", function() {
            return request;
        }), __webpack_require__.d(interface_namespaceObject, "send", function() {
            return _send;
        }), __webpack_require__.d(interface_namespaceObject, "sendToParent", function() {
            return sendToParent;
        }), __webpack_require__.d(interface_namespaceObject, "client", function() {
            return client;
        }), __webpack_require__.d(interface_namespaceObject, "listen", function() {
            return listen;
        }), __webpack_require__.d(interface_namespaceObject, "on", function() {
            return _on;
        }), __webpack_require__.d(interface_namespaceObject, "once", function() {
            return once;
        }), __webpack_require__.d(interface_namespaceObject, "listener", function() {
            return server_listener;
        }), __webpack_require__.d(interface_namespaceObject, "CONFIG", function() {
            return conf.b;
        }), __webpack_require__.d(interface_namespaceObject, "disable", function() {
            return disable;
        });
        var src = __webpack_require__(1), esm_extends = __webpack_require__(5);
        function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
            var desc = {};
            return Object.keys(descriptor).forEach(function(key) {
                desc[key] = descriptor[key];
            }), desc.enumerable = !!desc.enumerable, desc.configurable = !!desc.configurable, 
            ("value" in desc || desc.initializer) && (desc.writable = !0), desc = decorators.slice().reverse().reduce(function(desc, decorator) {
                return decorator(target, property, desc) || desc;
            }, desc), context && void 0 !== desc.initializer && (desc.value = desc.initializer ? desc.initializer.call(context) : void 0, 
            desc.initializer = void 0), void 0 === desc.initializer && (Object.defineProperty(target, property, desc), 
            desc = null), desc;
        }
        var _SERIALIZER, lib = __webpack_require__(6), cross_domain_utils_src = __webpack_require__(0), conf = __webpack_require__(3), TYPE = {
            FUNCTION: "function",
            ERROR: "error",
            PROMISE: "promise",
            REGEX: "regex",
            DATE: "date",
            ARRAY: "array",
            OBJECT: "object",
            STRING: "string",
            NUMBER: "number",
            BOOLEAN: "boolean",
            NULL: "null",
            UNDEFINED: "undefined"
        };
        function isSerializedType(item) {
            return "object" == typeof item && null !== item && "string" == typeof item.__type__;
        }
        function determineType(val) {
            return void 0 === val ? TYPE.UNDEFINED : null === val ? TYPE.NULL : Array.isArray(val) ? TYPE.ARRAY : "function" == typeof val ? TYPE.FUNCTION : "object" == typeof val ? val instanceof Error ? TYPE.ERROR : "function" == typeof val.then ? TYPE.PROMISE : "[object RegExp]" === {}.toString.call(val) ? TYPE.REGEX : "[object Date]" === {}.toString.call(val) ? TYPE.DATE : TYPE.OBJECT : "string" == typeof val ? TYPE.STRING : "number" == typeof val ? TYPE.NUMBER : "boolean" == typeof val ? TYPE.BOOLEAN : void 0;
        }
        function serializeType(type, val) {
            return {
                __type__: type,
                __val__: val
            };
        }
        var _DESERIALIZER, SERIALIZER = ((_SERIALIZER = {})[TYPE.FUNCTION] = function() {}, 
        _SERIALIZER[TYPE.ERROR] = function(_ref) {
            return serializeType(TYPE.ERROR, {
                message: _ref.message,
                stack: _ref.stack,
                code: _ref.code
            });
        }, _SERIALIZER[TYPE.PROMISE] = function() {}, _SERIALIZER[TYPE.REGEX] = function(val) {
            return serializeType(TYPE.REGEX, val.source);
        }, _SERIALIZER[TYPE.DATE] = function(val) {
            return serializeType(TYPE.DATE, val.toJSON());
        }, _SERIALIZER[TYPE.ARRAY] = function(val) {
            return val;
        }, _SERIALIZER[TYPE.OBJECT] = function(val) {
            return val;
        }, _SERIALIZER[TYPE.STRING] = function(val) {
            return val;
        }, _SERIALIZER[TYPE.NUMBER] = function(val) {
            return val;
        }, _SERIALIZER[TYPE.BOOLEAN] = function(val) {
            return val;
        }, _SERIALIZER[TYPE.NULL] = function(val) {
            return val;
        }, _SERIALIZER), defaultSerializers = {}, DESERIALIZER = ((_DESERIALIZER = {})[TYPE.FUNCTION] = function() {
            throw new Error("Function serialization is not implemented; nothing to deserialize");
        }, _DESERIALIZER[TYPE.ERROR] = function(_ref2) {
            var stack = _ref2.stack, code = _ref2.code, error = new Error(_ref2.message);
            return error.code = code, error.stack = stack + "\n\n" + error.stack, error;
        }, _DESERIALIZER[TYPE.PROMISE] = function() {
            throw new Error("Promise serialization is not implemented; nothing to deserialize");
        }, _DESERIALIZER[TYPE.REGEX] = function(val) {
            return new RegExp(val);
        }, _DESERIALIZER[TYPE.DATE] = function(val) {
            return new Date(val);
        }, _DESERIALIZER[TYPE.ARRAY] = function(val) {
            return val;
        }, _DESERIALIZER[TYPE.OBJECT] = function(val) {
            return val;
        }, _DESERIALIZER[TYPE.STRING] = function(val) {
            return val;
        }, _DESERIALIZER[TYPE.NUMBER] = function(val) {
            return val;
        }, _DESERIALIZER[TYPE.BOOLEAN] = function(val) {
            return val;
        }, _DESERIALIZER[TYPE.NULL] = function(val) {
            return val;
        }, _DESERIALIZER), defaultDeserializers = {}, zalgo_promise_src = __webpack_require__(2), src_global = __webpack_require__(4), winToProxyWindow = Object(src_global.c)("winToProxyWindow"), idToProxyWindow = Object(src_global.b)("idToProxyWindow");
        function cleanupProxyWindows() {
            for (var _i2 = 0, _idToProxyWindow$keys2 = idToProxyWindow.keys(); _i2 < _idToProxyWindow$keys2.length; _i2++) {
                var id = _idToProxyWindow$keys2[_i2];
                idToProxyWindow.get(id).shouldClean() && idToProxyWindow.del(id);
            }
        }
        var window_ProxyWindow = function() {
            function ProxyWindow(serializedWindow, actualWindow) {
                this.isProxyWindow = !0, this.serializedWindow = void 0, this.actualWindow = void 0, 
                this.actualWindowPromise = void 0, this.serializedWindow = serializedWindow, this.actualWindowPromise = new zalgo_promise_src.a(), 
                actualWindow && this.setWindow(actualWindow), this.serializedWindow.getInstanceID = Object(src.w)(this.serializedWindow.getInstanceID);
            }
            var _proto = ProxyWindow.prototype;
            return _proto.getType = function() {
                return this.serializedWindow.type;
            }, _proto.isPopup = function() {
                return this.getType() === cross_domain_utils_src.a.POPUP;
            }, _proto.isIframe = function() {
                return this.getType() === cross_domain_utils_src.a.IFRAME;
            }, _proto.setLocation = function(href) {
                var _this = this;
                return zalgo_promise_src.a.try(function() {
                    if (!_this.actualWindow) return _this.serializedWindow.setLocation(href);
                    _this.actualWindow.location = href;
                }).then(function() {
                    return _this;
                });
            }, _proto.setName = function(name) {
                var _this2 = this;
                return zalgo_promise_src.a.try(function() {
                    if (!_this2.actualWindow) return _this2.serializedWindow.setName(name);
                    if (!Object(cross_domain_utils_src.s)(_this2.actualWindow)) throw new Error("Can not set name for window on different domain");
                    _this2.actualWindow.name = name, _this2.actualWindow.frameElement && _this2.actualWindow.frameElement.setAttribute("name", name), 
                    (0, __webpack_require__(7).linkWindow)({
                        win: _this2.actualWindow,
                        name: name
                    });
                }).then(function() {
                    return _this2;
                });
            }, _proto.close = function() {
                var _this3 = this;
                return zalgo_promise_src.a.try(function() {
                    if (!_this3.actualWindow) return _this3.serializedWindow.close();
                    _this3.actualWindow.close();
                }).then(function() {
                    return _this3;
                });
            }, _proto.focus = function() {
                var _this4 = this;
                return zalgo_promise_src.a.try(function() {
                    return _this4.actualWindow && _this4.actualWindow.focus(), _this4.serializedWindow.focus();
                }).then(function() {
                    return _this4;
                });
            }, _proto.isClosed = function() {
                var _this5 = this;
                return zalgo_promise_src.a.try(function() {
                    return _this5.actualWindow ? Object(cross_domain_utils_src.w)(_this5.actualWindow) : _this5.serializedWindow.isClosed();
                });
            }, _proto.getWindow = function() {
                return this.actualWindow;
            }, _proto.setWindow = function(win) {
                this.actualWindow = win, this.actualWindowPromise.resolve(win);
            }, _proto.awaitWindow = function() {
                return this.actualWindowPromise;
            }, _proto.matchWindow = function(win) {
                var _this6 = this;
                return zalgo_promise_src.a.try(function() {
                    return _this6.actualWindow ? win === _this6.actualWindow : zalgo_promise_src.a.all([ _this6.getInstanceID(), Object(lib.b)(win) ]).then(function(_ref) {
                        var match = _ref[0] === _ref[1];
                        return match && _this6.setWindow(win), match;
                    });
                });
            }, _proto.unwrap = function() {
                return this.actualWindow || this;
            }, _proto.getInstanceID = function() {
                return this.actualWindow ? Object(lib.b)(this.actualWindow) : this.serializedWindow.getInstanceID();
            }, _proto.serialize = function() {
                return this.serializedWindow;
            }, _proto.shouldClean = function() {
                return this.actualWindow && Object(cross_domain_utils_src.w)(this.actualWindow);
            }, ProxyWindow.unwrap = function(win) {
                return ProxyWindow.isProxyWindow(win) ? win.unwrap() : win;
            }, ProxyWindow.serialize = function(win) {
                return cleanupProxyWindows(), ProxyWindow.toProxyWindow(win).serialize();
            }, ProxyWindow.deserialize = function(serializedWindow) {
                return cleanupProxyWindows(), idToProxyWindow.getOrSet(serializedWindow.id, function() {
                    return new ProxyWindow(serializedWindow);
                });
            }, ProxyWindow.isProxyWindow = function(obj) {
                return Boolean(obj && !Object(cross_domain_utils_src.v)(obj) && obj.isProxyWindow);
            }, ProxyWindow.toProxyWindow = function(win) {
                return cleanupProxyWindows(), ProxyWindow.isProxyWindow(win) ? win : winToProxyWindow.getOrSet(win, function() {
                    var id = Object(src.H)();
                    return idToProxyWindow.set(id, new ProxyWindow({
                        id: id,
                        type: Object(cross_domain_utils_src.k)(win) ? cross_domain_utils_src.a.POPUP : cross_domain_utils_src.a.IFRAME,
                        getInstanceID: function() {
                            return Object(lib.b)(win);
                        },
                        close: function() {
                            return zalgo_promise_src.a.try(function() {
                                win.close();
                            });
                        },
                        focus: function() {
                            return zalgo_promise_src.a.try(function() {
                                win.focus();
                            });
                        },
                        isClosed: function() {
                            return zalgo_promise_src.a.try(function() {
                                return Object(cross_domain_utils_src.w)(win);
                            });
                        },
                        setLocation: function(href) {
                            return zalgo_promise_src.a.try(function() {
                                if (Object(cross_domain_utils_src.s)(win)) try {
                                    if (win.location && "function" == typeof win.location.replace) return void win.location.replace(href);
                                } catch (err) {}
                                win.location = href;
                            });
                        },
                        setName: function(name) {
                            return zalgo_promise_src.a.try(function() {
                                (0, __webpack_require__(7).linkWindow)({
                                    win: win,
                                    name: name
                                }), win.name = name;
                            });
                        }
                    }, win));
                });
            }, ProxyWindow;
        }(), methodStore = Object(src_global.c)("methodStore"), proxyWindowMethods = Object(src_global.b)("proxyWindowMethods");
        function addMethod(id, val, name, source, domain) {
            window_ProxyWindow.isProxyWindow(source) ? proxyWindowMethods.set(id, {
                val: val,
                name: name,
                domain: domain,
                source: source
            }) : (proxyWindowMethods.del(id), methodStore.getOrSet(source, function() {
                return {};
            })[id] = {
                domain: domain,
                name: name,
                val: val,
                source: source
            });
        }
        function lookupMethod(source, id) {
            return methodStore.getOrSet(source, function() {
                return {};
            })[id] || proxyWindowMethods.get(id);
        }
        src_global.a.listeningForFunctions = src_global.a.listeningForFunctions || !1;
        var listenForFunctionCalls = Object(src.B)(function() {
            src_global.a.listeningForFunctions || (src_global.a.listeningForFunctions = !0, 
            src_global.a.on(conf.d.METHOD, {
                origin: conf.i
            }, function(_ref) {
                var source = _ref.source, origin = _ref.origin, data = _ref.data, id = data.id, name = data.name;
                return zalgo_promise_src.a.try(function() {
                    var meth = lookupMethod(source, id);
                    if (!meth) throw new Error("Could not find method '" + data.name + "' with id: " + data.id + " in " + Object(cross_domain_utils_src.g)(window));
                    var methodSource = meth.source, domain = meth.domain, val = meth.val;
                    return zalgo_promise_src.a.try(function() {
                        if (!Object(cross_domain_utils_src.y)(domain, origin)) throw new Error("Method '" + data.name + "' domain " + JSON.stringify(Object(src.u)(meth.domain) ? meth.domain.source : meth.domain) + " does not match origin " + origin + " in " + Object(cross_domain_utils_src.g)(window));
                        if (window_ProxyWindow.isProxyWindow(methodSource)) return methodSource.matchWindow(source).then(function(match) {
                            if (!match) throw new Error("Method call '" + data.name + "' failed - proxy window does not match source in " + Object(cross_domain_utils_src.g)(window));
                        });
                    }).then(function() {
                        return val.apply({
                            source: source,
                            origin: origin
                        }, data.args);
                    }, function(err) {
                        return zalgo_promise_src.a.try(function() {
                            if (val.onError) return val.onError(err);
                        }).then(function() {
                            throw err;
                        });
                    }).then(function(result) {
                        return {
                            result: result,
                            id: id,
                            name: name
                        };
                    });
                });
            }));
        });
        function function_serializeFunction(destination, domain, val, key) {
            listenForFunctionCalls();
            var id = val.__id__ || Object(src.H)();
            destination = window_ProxyWindow.unwrap(destination);
            var name = val.__name__ || val.name || key;
            return window_ProxyWindow.isProxyWindow(destination) ? (addMethod(id, val, name, destination, domain), 
            destination.awaitWindow().then(function(win) {
                addMethod(id, val, name, win, domain);
            })) : addMethod(id, val, name, destination, domain), serializeType(conf.h.CROSS_DOMAIN_FUNCTION, {
                id: id,
                name: name
            });
        }
        function serializeMessage(destination, domain, obj) {
            var _serialize;
            return function(obj, serializers) {
                void 0 === serializers && (serializers = defaultSerializers);
                var result = JSON.stringify(obj, function(key) {
                    var val = this[key];
                    if (isSerializedType(this)) return val;
                    var type = determineType(val);
                    if (!type) return val;
                    var serializer = serializers[type] || SERIALIZER[type];
                    return serializer ? serializer(val, key) : val;
                });
                return void 0 === result ? TYPE.UNDEFINED : result;
            }(obj, ((_serialize = {})[TYPE.PROMISE] = function(val, key) {
                return function(destination, domain, val, key) {
                    return serializeType(conf.h.CROSS_DOMAIN_ZALGO_PROMISE, {
                        then: function_serializeFunction(destination, domain, function(resolve, reject) {
                            return val.then(resolve, reject);
                        }, key)
                    });
                }(destination, domain, val, key);
            }, _serialize[TYPE.FUNCTION] = function(val, key) {
                return function_serializeFunction(destination, domain, val, key);
            }, _serialize[TYPE.OBJECT] = function(val) {
                return Object(cross_domain_utils_src.v)(val) || window_ProxyWindow.isProxyWindow(val) ? serializeType(conf.h.CROSS_DOMAIN_WINDOW, window_ProxyWindow.serialize(val)) : val;
            }, _serialize));
        }
        function deserializeMessage(source, origin, message) {
            var _deserialize;
            return function(str, deserializers) {
                if (void 0 === deserializers && (deserializers = defaultDeserializers), str !== TYPE.UNDEFINED) return JSON.parse(str, function(key, val) {
                    if (isSerializedType(this)) return val;
                    var type, value;
                    if (isSerializedType(val) ? (type = val.__type__, value = val.__val__) : (type = determineType(val), 
                    value = val), !type) return value;
                    var deserializer = deserializers[type] || DESERIALIZER[type];
                    return deserializer ? deserializer(value, key) : value;
                });
            }(message, ((_deserialize = {})[conf.h.CROSS_DOMAIN_ZALGO_PROMISE] = function(serializedPromise) {
                return new zalgo_promise_src.a(serializedPromise.then);
            }, _deserialize[conf.h.CROSS_DOMAIN_FUNCTION] = function(serializedFunction) {
                return function(source, origin, _ref2) {
                    var id = serializedFunction.id, name = serializedFunction.name, getDeserializedFunction = function(opts) {
                        function crossDomainFunctionWrapper() {
                            var _arguments = arguments;
                            return window_ProxyWindow.toProxyWindow(source).awaitWindow().then(function(win) {
                                var meth = lookupMethod(win, id);
                                return meth && meth.val !== crossDomainFunctionWrapper ? meth.val.apply({
                                    source: window,
                                    origin: Object(cross_domain_utils_src.g)()
                                }, _arguments) : src_global.a.send(win, conf.d.METHOD, {
                                    id: id,
                                    name: name,
                                    args: [].slice.call(_arguments)
                                }, {
                                    domain: origin,
                                    fireAndForget: opts.fireAndForget
                                }).then(function(res) {
                                    if (!opts.fireAndForget) return res.data.result;
                                });
                            }).catch(function(err) {
                                throw err;
                            });
                        }
                        return void 0 === opts && (opts = {}), crossDomainFunctionWrapper.__name__ = name, 
                        crossDomainFunctionWrapper.__origin__ = origin, crossDomainFunctionWrapper.__source__ = source, 
                        crossDomainFunctionWrapper.__id__ = id, crossDomainFunctionWrapper.origin = origin, 
                        crossDomainFunctionWrapper;
                    }, crossDomainFunctionWrapper = getDeserializedFunction();
                    return crossDomainFunctionWrapper.fireAndForget = getDeserializedFunction({
                        fireAndForget: !0
                    }), crossDomainFunctionWrapper;
                }(source, origin);
            }, _deserialize[conf.h.CROSS_DOMAIN_WINDOW] = function(serializedWindow) {
                return window_ProxyWindow.deserialize(serializedWindow);
            }, _deserialize));
        }
        var SEND_MESSAGE_STRATEGIES = {};
        SEND_MESSAGE_STRATEGIES[conf.g.POST_MESSAGE] = function(win, serializedMessage, domain) {
            (Array.isArray(domain) ? domain : "string" == typeof domain ? [ domain ] : [ conf.i ]).map(function(dom) {
                if (0 === dom.indexOf(conf.f.MOCK)) {
                    if (window.location.protocol === conf.f.FILE) return conf.i;
                    if (!Object(cross_domain_utils_src.o)(win)) throw new Error("Attempting to send messsage to mock domain " + dom + ", but window is actually cross-domain");
                    return Object(cross_domain_utils_src.c)(win);
                }
                return 0 === dom.indexOf(conf.f.FILE) ? conf.i : dom;
            }).forEach(function(dom) {
                return win.postMessage(serializedMessage, dom);
            });
        };
        var strategies_require = __webpack_require__(7), sendBridgeMessage = strategies_require.sendBridgeMessage, needsBridgeForBrowser = strategies_require.needsBridgeForBrowser, isBridge = strategies_require.isBridge;
        function sendMessage(win, domain, message) {
            return zalgo_promise_src.a.try(function() {
                var _serializeMessage;
                if (Object(cross_domain_utils_src.w)(win)) throw new Error("Window is closed");
                var serializedMessage = serializeMessage(win, domain, ((_serializeMessage = {})[conf.j.POSTROBOT] = Object(esm_extends.a)({
                    id: Object(src.H)()
                }, message), _serializeMessage)), messages = [];
                return zalgo_promise_src.a.map(Object.keys(SEND_MESSAGE_STRATEGIES), function(strategyName) {
                    return zalgo_promise_src.a.try(function() {
                        if (!conf.b.ALLOWED_POST_MESSAGE_METHODS[strategyName]) throw new Error("Strategy disallowed: " + strategyName);
                        return SEND_MESSAGE_STRATEGIES[strategyName](win, serializedMessage, domain);
                    }).then(function() {
                        return messages.push(strategyName + ": success"), !0;
                    }, function(err) {
                        return messages.push(strategyName + ": " + Object(src.F)(err) + "\n"), !1;
                    });
                }).then(function(results) {
                    var success = results.some(Boolean), status = message.type + " " + message.name + " " + (success ? "success" : "error") + ":\n  - " + messages.join("\n  - ") + "\n";
                    if (!success) throw new Error(status);
                });
            });
        }
        SEND_MESSAGE_STRATEGIES[conf.g.BRIDGE] = function(win, serializedMessage, domain) {
            if (needsBridgeForBrowser() || isBridge()) {
                if (Object(cross_domain_utils_src.s)(win)) throw new Error("Post message through bridge disabled between same domain windows");
                if (!1 !== Object(cross_domain_utils_src.t)(window, win)) throw new Error("Can only use bridge to communicate between two different windows, not between frames");
                return sendBridgeMessage(win, domain, serializedMessage);
            }
        }, SEND_MESSAGE_STRATEGIES[conf.g.GLOBAL] = function(win, serializedMessage) {
            if (Object(lib.f)()) {
                if (!Object(cross_domain_utils_src.s)(win)) throw new Error("Post message through global disabled between different domain windows");
                if (!1 !== Object(cross_domain_utils_src.t)(window, win)) throw new Error("Can only use global to communicate between two different windows, not between frames");
                var foreignGlobal = win[conf.j.POSTROBOT];
                if (!foreignGlobal) throw new Error("Can not find postRobot global on foreign window");
                return foreignGlobal.receiveMessage({
                    source: window,
                    origin: Object(cross_domain_utils_src.g)(),
                    data: serializedMessage
                });
            }
        };
        var responseListeners = Object(src_global.b)("responseListeners"), requestListeners = Object(src_global.c)("requestListeners"), erroredResponseListeners = Object(src_global.b)("erroredResponseListeners");
        src_global.a.WINDOW_WILDCARD = src_global.a.WINDOW_WILDCARD || new function() {}();
        var _RECEIVE_MESSAGE_TYPE, __DOMAIN_REGEX__ = "__domain_regex__";
        function getResponseListener(hash) {
            return responseListeners.get(hash);
        }
        function deleteResponseListener(hash) {
            responseListeners.del(hash);
        }
        function isResponseListenerErrored(hash) {
            return erroredResponseListeners.has(hash);
        }
        function getRequestListener(_ref) {
            var name = _ref.name, win = _ref.win, domain = _ref.domain;
            if (win === conf.i && (win = null), domain === conf.i && (domain = null), !name) throw new Error("Name required to get request listener");
            for (var _i2 = 0, _ref3 = [ win, src_global.a.WINDOW_WILDCARD ]; _i2 < _ref3.length; _i2++) {
                var winQualifier = _ref3[_i2];
                if (winQualifier) {
                    var nameListeners = requestListeners.get(winQualifier);
                    if (nameListeners) {
                        var domainListeners = nameListeners[name];
                        if (domainListeners) {
                            if (domain && "string" == typeof domain) {
                                if (domainListeners[domain]) return domainListeners[domain];
                                if (domainListeners[__DOMAIN_REGEX__]) for (var _i4 = 0, _domainListeners$__DO2 = domainListeners[__DOMAIN_REGEX__]; _i4 < _domainListeners$__DO2.length; _i4++) {
                                    var _domainListeners$__DO3 = _domainListeners$__DO2[_i4], regex = _domainListeners$__DO3.regex, listener = _domainListeners$__DO3.listener;
                                    if (Object(cross_domain_utils_src.y)(regex, domain)) return listener;
                                }
                            }
                            if (domainListeners[conf.i]) return domainListeners[conf.i];
                        }
                    }
                }
            }
        }
        var RECEIVE_MESSAGE_TYPES = ((_RECEIVE_MESSAGE_TYPE = {})[conf.e.REQUEST] = function(source, origin, message) {
            var options = getRequestListener({
                name: message.name,
                win: source,
                domain: origin
            });
            function sendResponse(type, ack, response) {
                return void 0 === response && (response = {}), message.fireAndForget || Object(cross_domain_utils_src.w)(source) ? zalgo_promise_src.a.resolve() : sendMessage(source, origin, Object(esm_extends.a)({
                    type: type,
                    ack: ack,
                    hash: message.hash,
                    name: message.name
                }, response));
            }
            return zalgo_promise_src.a.all([ sendResponse(conf.e.ACK), zalgo_promise_src.a.try(function() {
                if (!options) throw new Error("No handler found for post message: " + message.name + " from " + origin + " in " + window.location.protocol + "//" + window.location.host + window.location.pathname);
                if (!Object(cross_domain_utils_src.y)(options.domain, origin)) throw new Error("Request origin " + origin + " does not match domain " + options.domain.toString());
                return options.handler({
                    source: source,
                    origin: origin,
                    data: message.data
                });
            }).then(function(data) {
                return sendResponse(conf.e.RESPONSE, conf.c.SUCCESS, {
                    data: data
                });
            }, function(error) {
                return sendResponse(conf.e.RESPONSE, conf.c.ERROR, {
                    error: error
                });
            }) ]).then(src.y).catch(function(err) {
                if (options && options.handleError) return options.handleError(err);
                throw err;
            });
        }, _RECEIVE_MESSAGE_TYPE[conf.e.ACK] = function(source, origin, message) {
            if (!isResponseListenerErrored(message.hash)) {
                var options = getResponseListener(message.hash);
                if (!options) throw new Error("No handler found for post message ack for message: " + message.name + " from " + origin + " in " + window.location.protocol + "//" + window.location.host + window.location.pathname);
                if (!Object(cross_domain_utils_src.y)(options.domain, origin)) throw new Error("Ack origin " + origin + " does not match domain " + options.domain.toString());
                options.ack = !0;
            }
        }, _RECEIVE_MESSAGE_TYPE[conf.e.RESPONSE] = function(source, origin, message) {
            if (!isResponseListenerErrored(message.hash)) {
                var options = getResponseListener(message.hash);
                if (!options) throw new Error("No handler found for post message response for message: " + message.name + " from " + origin + " in " + window.location.protocol + "//" + window.location.host + window.location.pathname);
                if (!Object(cross_domain_utils_src.y)(options.domain, origin)) throw new Error("Response origin " + origin + " does not match domain " + Object(cross_domain_utils_src.B)(options.domain));
                return deleteResponseListener(message.hash), message.ack === conf.c.ERROR ? options.respond(message.error, null) : message.ack === conf.c.SUCCESS ? options.respond(null, {
                    source: source,
                    origin: origin,
                    data: message.data
                }) : void 0;
            }
        }, _RECEIVE_MESSAGE_TYPE), receivedMessages = Object(src_global.b)("receivedMessages");
        function receiveMessage(event) {
            if (!window || window.closed) throw new Error("Message recieved in closed window");
            try {
                if (!event.source) return;
            } catch (err) {
                return;
            }
            var source = event.source, origin = event.origin, message = function(message, source, origin) {
                var parsedMessage;
                try {
                    parsedMessage = deserializeMessage(source, origin, message);
                } catch (err) {
                    return;
                }
                if (parsedMessage && "object" == typeof parsedMessage && null !== parsedMessage && (parsedMessage = parsedMessage[conf.j.POSTROBOT]) && "object" == typeof parsedMessage && null !== parsedMessage && parsedMessage.type && "string" == typeof parsedMessage.type && RECEIVE_MESSAGE_TYPES[parsedMessage.type]) return parsedMessage;
            }(event.data, source, origin);
            message && (Object(lib.e)(source), receivedMessages.has(message.id) || (receivedMessages.set(message.id, !0), 
            Object(cross_domain_utils_src.w)(source) && !message.fireAndForget || RECEIVE_MESSAGE_TYPES[message.type](source, origin, message)));
        }
        function messageListener(event) {
            try {
                Object(src.y)(event.source);
            } catch (err) {
                return;
            }
            var messageEvent = {
                source: event.source || event.sourceElement,
                origin: event.origin || event.originalEvent && event.originalEvent.origin,
                data: event.data
            };
            if (messageEvent.source) {
                if (!messageEvent.origin) throw new Error("Post message did not have origin domain");
                receiveMessage(messageEvent);
            }
        }
        src_global.a.receiveMessage = receiveMessage;
        var requestPromises = Object(src_global.c)("requestPromises");
        function request(options) {
            return zalgo_promise_src.a.try(function() {
                if (!options.name) throw new Error("Expected options.name");
                var targetWindow, domain, name = options.name;
                if ("string" == typeof options.window) {
                    var el = document.getElementById(options.window);
                    if (!el) throw new Error("Expected options.window " + {}.toString.call(options.window) + " to be a valid element id");
                    if ("iframe" !== el.tagName.toLowerCase()) throw new Error("Expected options.window " + {}.toString.call(options.window) + " to be an iframe");
                    if (!el.contentWindow) throw new Error("Iframe must have contentWindow.  Make sure it has a src attribute and is in the DOM.");
                    targetWindow = el.contentWindow;
                } else if (options.window instanceof HTMLIFrameElement) {
                    if ("iframe" !== options.window.tagName.toLowerCase()) throw new Error("Expected options.window " + {}.toString.call(options.window) + " to be an iframe");
                    if (options.window && !options.window.contentWindow) throw new Error("Iframe must have contentWindow.  Make sure it has a src attribute and is in the DOM.");
                    options.window && options.window.contentWindow && (targetWindow = options.window.contentWindow);
                } else targetWindow = options.window;
                if (!targetWindow) throw new Error("Expected options.window to be a window object, iframe, or iframe element id.");
                var win = targetWindow;
                domain = options.domain || conf.i;
                var hash = options.name + "_" + Object(src.H)();
                if (Object(cross_domain_utils_src.w)(win)) throw new Error("Target window is closed");
                var hasResult = !1, reqPromises = requestPromises.getOrSet(win, function() {
                    return [];
                }), requestPromise = zalgo_promise_src.a.try(function() {
                    if (Object(cross_domain_utils_src.p)(window, win)) return Object(lib.a)(win, options.timeout || conf.b.CHILD_WINDOW_TIMEOUT);
                }).then(function(_temp) {
                    var origin = (void 0 === _temp ? {} : _temp).domain;
                    if (Object(src.u)(domain) && !origin) return Object(lib.g)(win);
                }).then(function(_temp2) {
                    var origin = (void 0 === _temp2 ? {} : _temp2).domain;
                    if (Object(src.u)(domain)) {
                        if (!Object(cross_domain_utils_src.y)(domain, origin)) throw new Error("Remote window domain " + origin + " does not match regex: " + domain.toString());
                        domain = origin;
                    }
                    if ("string" != typeof domain && !Array.isArray(domain)) throw new TypeError("Expected domain to be a string or array");
                    var actualDomain = domain;
                    return new zalgo_promise_src.a(function(resolve, reject) {
                        var responseListener;
                        if (options.fireAndForget || function(hash, listener) {
                            responseListeners.set(hash, listener);
                        }(hash, responseListener = {
                            name: name,
                            window: win,
                            domain: actualDomain,
                            respond: function(err, result) {
                                err || (hasResult = !0, reqPromises.splice(reqPromises.indexOf(requestPromise, 1))), 
                                err ? reject(err) : resolve(result);
                            }
                        }), sendMessage(win, actualDomain, {
                            type: conf.e.REQUEST,
                            hash: hash,
                            name: name,
                            data: options.data,
                            fireAndForget: Boolean(options.fireAndForget)
                        }).catch(reject), options.fireAndForget) return resolve();
                        var totalAckTimeout = Object(lib.d)(win) ? conf.b.ACK_TIMEOUT_KNOWN : conf.b.ACK_TIMEOUT, totalResTimeout = options.timeout || conf.b.RES_TIMEOUT, ackTimeout = totalAckTimeout, resTimeout = totalResTimeout, cycleTime = 100;
                        setTimeout(function cycle() {
                            if (!hasResult) {
                                if (Object(cross_domain_utils_src.w)(win)) return reject(responseListener.ack ? new Error("Window closed for " + name + " before response") : new Error("Window closed for " + name + " before ack"));
                                if (ackTimeout = Math.max(ackTimeout - cycleTime, 0), -1 !== resTimeout && (resTimeout = Math.max(resTimeout - cycleTime, 0)), 
                                responseListener.ack) {
                                    if (-1 === resTimeout) return;
                                    cycleTime = Math.min(resTimeout, 2e3);
                                } else {
                                    if (0 === ackTimeout) return reject(new Error("No ack for postMessage " + name + " in " + Object(cross_domain_utils_src.g)() + " in " + totalAckTimeout + "ms"));
                                    if (0 === resTimeout) return reject(new Error("No response for postMessage " + name + " in " + Object(cross_domain_utils_src.g)() + " in " + totalResTimeout + "ms"));
                                }
                                setTimeout(cycle, cycleTime);
                            }
                        }, cycleTime);
                    });
                });
                return requestPromise.catch(function() {
                    !function(hash) {
                        erroredResponseListeners.set(hash, !0);
                    }(hash), deleteResponseListener(hash);
                }), reqPromises.push(requestPromise), requestPromise;
            });
        }
        function _send(window, name, data, options) {
            return (options = options || {}).window = window, options.name = name, options.data = data, 
            request(options);
        }
        function sendToParent(name, data, options) {
            var win = Object(cross_domain_utils_src.e)();
            return win ? _send(win, name, data, options) : new zalgo_promise_src.a(function(resolve, reject) {
                return reject(new Error("Window does not have a parent"));
            });
        }
        function client(options) {
            if (void 0 === options && (options = {}), !options.window) throw new Error("Expected options.window");
            var win = options.window;
            return {
                send: function(name, data) {
                    return _send(win, name, data, options);
                }
            };
        }
        function listen(options) {
            if (!options.name) throw new Error("Expected options.name");
            if (!options.handler) throw new Error("Expected options.handler");
            var name = options.name, win = options.window, domain = options.domain, listenerOptions = {
                handler: options.handler,
                handleError: options.errorHandler || function(err) {
                    throw err;
                },
                window: win,
                domain: domain || conf.i,
                name: name
            }, requestListener = function addRequestListener(_ref4, listener) {
                var name = _ref4.name, win = _ref4.win, domain = _ref4.domain;
                if (!name || "string" != typeof name) throw new Error("Name required to add request listener");
                if (Array.isArray(win)) {
                    for (var listenersCollection = [], _i6 = 0, _win2 = win; _i6 < _win2.length; _i6++) listenersCollection.push(addRequestListener({
                        name: name,
                        domain: domain,
                        win: _win2[_i6]
                    }, listener));
                    return {
                        cancel: function() {
                            for (var _i8 = 0; _i8 < listenersCollection.length; _i8++) listenersCollection[_i8].cancel();
                        }
                    };
                }
                if (Array.isArray(domain)) {
                    for (var _listenersCollection = [], _i10 = 0, _domain2 = domain; _i10 < _domain2.length; _i10++) _listenersCollection.push(addRequestListener({
                        name: name,
                        win: win,
                        domain: _domain2[_i10]
                    }, listener));
                    return {
                        cancel: function() {
                            for (var _i12 = 0; _i12 < _listenersCollection.length; _i12++) _listenersCollection[_i12].cancel();
                        }
                    };
                }
                var existingListener = getRequestListener({
                    name: name,
                    win: win,
                    domain: domain
                });
                if (win && win !== conf.i || (win = src_global.a.WINDOW_WILDCARD), domain = domain || conf.i, 
                existingListener) throw win && domain ? new Error("Request listener already exists for " + name + " on domain " + domain.toString() + " for " + (win === src_global.a.WINDOW_WILDCARD ? "wildcard" : "specified") + " window") : win ? new Error("Request listener already exists for " + name + " for " + (win === src_global.a.WINDOW_WILDCARD ? "wildcard" : "specified") + " window") : domain ? new Error("Request listener already exists for " + name + " on domain " + domain.toString()) : new Error("Request listener already exists for " + name);
                var regexListeners, regexListener, nameListeners = requestListeners.getOrSet(win, function() {
                    return {};
                }), domainListeners = Object(src.o)(nameListeners, name, function() {
                    return {};
                }), strDomain = domain.toString();
                return Object(src.u)(domain) ? (regexListeners = Object(src.o)(domainListeners, __DOMAIN_REGEX__, function() {
                    return [];
                })).push(regexListener = {
                    regex: domain,
                    listener: listener
                }) : domainListeners[strDomain] = listener, {
                    cancel: function() {
                        delete domainListeners[strDomain], regexListener && (regexListeners.splice(regexListeners.indexOf(regexListener, 1)), 
                        regexListeners.length || delete domainListeners[__DOMAIN_REGEX__]), Object.keys(domainListeners).length || delete nameListeners[name], 
                        win && !Object.keys(nameListeners).length && requestListeners.del(win);
                    }
                };
            }({
                name: name,
                win: win,
                domain: domain
            }, listenerOptions);
            if (options.once) {
                var _handler = listenerOptions.handler;
                listenerOptions.handler = Object(src.B)(function() {
                    return requestListener.cancel(), _handler.apply(this, arguments);
                });
            }
            if (listenerOptions.window && options.errorOnClose) var interval = Object(src.E)(function() {
                win && "object" == typeof win && Object(cross_domain_utils_src.w)(win) && (interval.cancel(), 
                listenerOptions.handleError(new Error("Post message target window is closed")));
            }, 50);
            return {
                cancel: function() {
                    requestListener.cancel();
                }
            };
        }
        function _on(name, options, handler) {
            return "function" == typeof options && (handler = options, options = {}), (options = options || {}).name = name, 
            options.handler = handler || options.handler, listen(options);
        }
        function once(name, options, handler) {
            void 0 === options && (options = {}), "function" == typeof options && (handler = options, 
            options = {}), options = options || {}, handler = handler || options.handler;
            var errorHandler = options.errorHandler, promise = new zalgo_promise_src.a(function(resolve, reject) {
                (options = options || {}).name = name, options.once = !0, options.handler = function(event) {
                    if (resolve(event), handler) return handler(event);
                }, options.errorHandler = function(err) {
                    if (reject(err), errorHandler) return errorHandler(err);
                };
            }), onceListener = listen(options);
            return promise.cancel = onceListener.cancel, promise;
        }
        function server_listener(options) {
            return void 0 === options && (options = {}), {
                on: function(name, handler) {
                    return _on(name, options, handler);
                }
            };
        }
        function disable() {
            delete window[conf.j.POSTROBOT], window.removeEventListener("message", messageListener);
        }
        src_global.a.send = _send, src_global.a.on = _on;
        var public_parent = Object(cross_domain_utils_src.e)();
        function cleanUpWindow(win) {
            for (var _i2 = 0, _requestPromises$get2 = requestPromises.get(win, []); _i2 < _requestPromises$get2.length; _i2++) _requestPromises$get2[_i2].reject(new Error("Window cleaned up before response")).catch(src.y);
        }
        var bridge = __webpack_require__(9);
        src_global.a.initialized || (src_global.a.initialized = !0, Object(src.b)(window, "message", messageListener), 
        bridge && bridge.openTunnelToOpener(), Object(lib.c)());
        var __ZOID__ = "__zoid__", PROP_TYPE = {
            STRING: "string",
            OBJECT: "object",
            FUNCTION: "function",
            BOOLEAN: "boolean",
            NUMBER: "number",
            ARRAY: "array"
        }, CONTEXT = cross_domain_utils_src.a, CLASS = {
            OUTLET: "zoid-outlet",
            COMPONENT_FRAME: "zoid-component-frame",
            PRERENDER_FRAME: "zoid-prerender-frame",
            VISIBLE: "zoid-visible",
            INVISIBLE: "zoid-invisible"
        }, WILDCARD = "*", DEFAULT_DIMENSIONS = {
            WIDTH: "300px",
            HEIGHT: "150px"
        };
        function globalFor(win) {
            if (Object(cross_domain_utils_src.s)(win)) return win[__ZOID__] || (win[__ZOID__] = {}), 
            win[__ZOID__];
        }
        var _class, global_global = function() {
            var global = globalFor(window);
            if (!global) throw new Error("Could not get local global");
            return global;
        }(), parseChildWindowName = Object(src.v)(function() {
            if (!window.name) throw new Error("No window name");
            var _window$name$split = window.name.split("__"), zoidcomp = _window$name$split[1], name = _window$name$split[2], encodedPayload = _window$name$split[3];
            if ("zoid" !== zoidcomp) throw new Error("Window not rendered by zoid - got " + zoidcomp);
            if (!name) throw new Error("Expected component name");
            if (!encodedPayload) throw new Error("Expected encoded payload");
            try {
                return JSON.parse(Object(src.e)(encodedPayload));
            } catch (err) {
                throw new Error("Can not decode window name payload: " + encodedPayload + ": " + Object(src.F)(err));
            }
        }), isZoidComponentWindow = Object(src.v)(function() {
            try {
                parseChildWindowName();
            } catch (err) {
                return !1;
            }
            return !0;
        });
        function getProxyElement(element) {
            return {
                resize: function(_ref) {
                    var width = _ref.width, height = _ref.height;
                    "number" == typeof width && (element.style.width = Object(src.G)(width)), "number" == typeof height && (element.style.height = Object(src.G)(height));
                },
                getElement: function() {
                    var _this = this;
                    return zalgo_promise_src.a.try(function() {
                        if (_this.source && _this.source !== window) throw new Error("Can not call getElement from a remote window");
                        return element;
                    });
                }
            };
        }
        function normalizeChildProp(component, props, key, value, helpers) {
            var prop = component.getPropDefinition(key);
            return prop && "function" == typeof prop.childDecorate ? prop.childDecorate({
                value: value,
                focus: helpers.focus,
                close: helpers.close,
                resize: helpers.resize,
                onError: helpers.onError,
                onPropsChange: helpers.onPropsChange
            }) : value;
        }
        var parent_class, child_ChildComponent = (_applyDecoratedDescriptor((_class = function() {
            function ChildComponent(component) {
                var _this = this;
                this.component = void 0, this.props = void 0, this.context = void 0, this.parent = void 0, 
                this.parentComponentWindow = void 0, this.onPropHandlers = void 0, this.autoResize = void 0, 
                zalgo_promise_src.a.try(function() {
                    _this.component = component, _this.onPropHandlers = [];
                    var _parseChildWindowName = parseChildWindowName(), parent = _parseChildWindowName.parent, domain = _parseChildWindowName.domain, exports = _parseChildWindowName.exports, props = _parseChildWindowName.props;
                    _this.context = _parseChildWindowName.context, _this.parentComponentWindow = _this.getWindowByRef(parent), 
                    _this.parent = deserializeMessage(_this.parentComponentWindow, domain, exports), 
                    _this.checkParentDomain(domain);
                    var initialProps = _this.getPropsByRef(_this.parentComponentWindow, domain, props);
                    return _this.setProps(initialProps, domain), Object(lib.e)(_this.parentComponentWindow), 
                    _this.watchForClose(), _this.parent.init(_this.buildExports());
                }).then(function() {
                    return _this.watchForResize();
                }).catch(function(err) {
                    _this.onError(err);
                });
            }
            var _proto = ChildComponent.prototype;
            return _proto.getHelpers = function() {
                var _this2 = this;
                return {
                    focus: function() {
                        return _this2.focus();
                    },
                    close: function() {
                        return _this2.close();
                    },
                    resize: function(_ref) {
                        return _this2.resize({
                            width: _ref.width,
                            height: _ref.height
                        });
                    },
                    onError: function(err) {
                        return _this2.onError(err);
                    },
                    onPropsChange: function(handler) {
                        return _this2.onPropsChange(handler);
                    }
                };
            }, _proto.checkParentDomain = function(domain) {
                if (!Object(cross_domain_utils_src.y)(this.component.allowedParentDomains, domain)) throw new Error("Can not be rendered by domain: " + domain);
            }, _proto.onPropsChange = function(handler) {
                this.onPropHandlers.push(handler);
            }, _proto.getPropsByRef = function(parentComponentWindow, domain, _ref2) {
                var props, type = _ref2.type, uid = _ref2.uid;
                if ("raw" === type) props = _ref2.value; else if ("uid" === type) {
                    if (!Object(cross_domain_utils_src.s)(parentComponentWindow)) {
                        if ("file:" === window.location.protocol) throw new Error("Can not get props from file:// domain");
                        throw new Error("Parent component window is on a different domain - expected " + Object(cross_domain_utils_src.g)() + " - can not retrieve props");
                    }
                    var global = globalFor(parentComponentWindow);
                    if (!global) throw new Error("Can not find global for parent component - can not retrieve props");
                    props = global.props[uid];
                }
                if (!props) throw new Error("Initial props not found");
                return deserializeMessage(parentComponentWindow, domain, props);
            }, _proto.getWindowByRef = function(ref) {
                var result, type = ref.type;
                if ("opener" === type) result = Object(cross_domain_utils_src.k)(window); else if ("top" === type) result = Object(cross_domain_utils_src.m)(window); else if ("parent" === type) {
                    var distance = ref.distance;
                    result = distance ? Object(cross_domain_utils_src.j)(window, distance) : Object(cross_domain_utils_src.l)(window);
                }
                if ("global" === type) {
                    var uid = ref.uid, ancestor = Object(cross_domain_utils_src.e)(window);
                    if (ancestor) for (var _i2 = 0, _getAllFramesInWindow2 = Object(cross_domain_utils_src.d)(ancestor); _i2 < _getAllFramesInWindow2.length; _i2++) {
                        var global = globalFor(_getAllFramesInWindow2[_i2]);
                        if (global && global.windows && global.windows[uid]) {
                            result = global.windows[uid];
                            break;
                        }
                    }
                }
                if (!result) throw new Error("Unable to find " + type + " window");
                return result;
            }, _proto.getProps = function() {
                return this.props = this.props || {}, this.props;
            }, _proto.setProps = function(props, origin, isUpdate) {
                void 0 === isUpdate && (isUpdate = !1);
                var helpers = this.getHelpers(), existingProps = this.getProps(), normalizedProps = function(parentComponentWindow, component, props, origin, helpers, isUpdate) {
                    void 0 === isUpdate && (isUpdate = !1);
                    for (var result = {}, _i2 = 0, _Object$keys2 = Object.keys(props); _i2 < _Object$keys2.length; _i2++) {
                        var key = _Object$keys2[_i2], prop = component.getPropDefinition(key);
                        if (!prop || !prop.sameDomain || origin === Object(cross_domain_utils_src.g)(window) && Object(cross_domain_utils_src.s)(parentComponentWindow)) {
                            var value = normalizeChildProp(component, 0, key, props[key], helpers);
                            result[key] = value, prop && prop.alias && !result[prop.alias] && (result[prop.alias] = value);
                        }
                    }
                    if (!isUpdate) for (var _i4 = 0, _component$getPropNam2 = component.getPropNames(); _i4 < _component$getPropNam2.length; _i4++) {
                        var _key = _component$getPropNam2[_i4];
                        props.hasOwnProperty(_key) || (result[_key] = normalizeChildProp(component, 0, _key, props[_key], helpers));
                    }
                    return result;
                }(this.parentComponentWindow, this.component, props, origin, helpers, isUpdate);
                Object(src.l)(existingProps, normalizedProps);
                for (var _i4 = 0, _this$onPropHandlers2 = this.onPropHandlers; _i4 < _this$onPropHandlers2.length; _i4++) _this$onPropHandlers2[_i4].call(this, existingProps);
            }, _proto.watchForClose = function() {
                var _this3 = this;
                window.addEventListener("beforeunload", function() {
                    _this3.parent.checkClose.fireAndForget();
                }), window.addEventListener("unload", function() {
                    _this3.parent.checkClose.fireAndForget();
                }), Object(cross_domain_utils_src.A)(this.parentComponentWindow, function() {
                    _this3.destroy();
                });
            }, _proto.enableAutoResize = function(_temp2) {
                var _ref3 = void 0 === _temp2 ? {} : _temp2, _ref3$width = _ref3.width, _ref3$height = _ref3.height, _ref3$element = _ref3.element;
                this.autoResize = {
                    width: void 0 !== _ref3$width && _ref3$width,
                    height: void 0 === _ref3$height || _ref3$height,
                    element: void 0 === _ref3$element ? "body" : _ref3$element
                }, this.watchForResize();
            }, _proto.getAutoResize = function() {
                var _ref4 = this.autoResize || this.component.autoResize || {}, _ref4$width = _ref4.width, _ref4$height = _ref4.height, _ref4$element = _ref4.element, element = void 0 === _ref4$element ? "body" : _ref4$element;
                return {
                    width: void 0 !== _ref4$width && _ref4$width,
                    height: void 0 !== _ref4$height && _ref4$height,
                    element: element = Object(src.n)(element)
                };
            }, _proto.watchForResize = function() {
                var _this4 = this;
                return Object(src.J)().then(function() {
                    var _this4$getAutoResize = _this4.getAutoResize(), width = _this4$getAutoResize.width, height = _this4$getAutoResize.height, element = _this4$getAutoResize.element;
                    element && (width || height) && _this4.context !== CONTEXT.POPUP && Object(src.A)(element, function(_ref5) {
                        _this4.resize({
                            width: width ? _ref5.width : void 0,
                            height: height ? _ref5.height : void 0
                        });
                    }, {
                        width: width,
                        height: height
                    });
                });
            }, _proto.buildExports = function() {
                var self = this;
                return {
                    updateProps: function(props) {
                        var _this5 = this;
                        return zalgo_promise_src.a.try(function() {
                            return self.setProps(props, _this5.__origin__, !0);
                        });
                    },
                    close: function() {
                        return zalgo_promise_src.a.try(function() {
                            return self.destroy();
                        });
                    }
                };
            }, _proto.resize = function(_ref6) {
                return this.parent.resize.fireAndForget({
                    width: _ref6.width,
                    height: _ref6.height
                });
            }, _proto.close = function() {
                return this.parent.close();
            }, _proto.destroy = function() {
                return zalgo_promise_src.a.try(function() {
                    window.close();
                });
            }, _proto.focus = function() {
                return zalgo_promise_src.a.try(function() {
                    window.focus();
                });
            }, _proto.onError = function(err) {
                var _this6 = this;
                return zalgo_promise_src.a.try(function() {
                    if (_this6.parent && _this6.parent.onError) return _this6.parent.onError(err);
                    throw err;
                });
            }, ChildComponent;
        }()).prototype, "watchForResize", [ src.x ], Object.getOwnPropertyDescriptor(_class.prototype, "watchForResize"), _class.prototype), 
        _class), RENDER_DRIVERS = {};
        function getQueryParam(prop, key, value) {
            return zalgo_promise_src.a.try(function() {
                return "function" == typeof prop.queryParam ? prop.queryParam({
                    value: value
                }) : "string" == typeof prop.queryParam ? prop.queryParam : key;
            });
        }
        function getQueryValue(prop, key, value) {
            return zalgo_promise_src.a.try(function() {
                return "function" == typeof prop.queryValue && Object(src.q)(value) ? prop.queryValue({
                    value: value
                }) : value;
            });
        }
        RENDER_DRIVERS[CONTEXT.IFRAME] = {
            renderedIntoContainer: !0,
            open: function(proxyOutlet) {
                var _this = this;
                if (!proxyOutlet) throw new Error("Expected container element to be passed");
                return proxyOutlet.getElement().then(function(outlet) {
                    var frame = Object(src.p)({
                        attributes: Object(esm_extends.a)({
                            title: _this.component.name
                        }, _this.component.attributes.iframe),
                        class: [ CLASS.COMPONENT_FRAME, CLASS.INVISIBLE ]
                    }, outlet), frameWatcher = Object(src.K)(frame, function() {
                        return _this.close();
                    });
                    return _this.clean.register(function() {
                        return frameWatcher.cancel();
                    }), _this.clean.register(function() {
                        return Object(src.i)(frame);
                    }), Object(src.d)(frame).then(function(win) {
                        return _this.clean.register(function() {
                            return cleanUpWindow(win);
                        }), {
                            proxyWin: window_ProxyWindow.toProxyWindow(win),
                            proxyFrame: getProxyElement(frame)
                        };
                    });
                });
            },
            openPrerender: function(proxyWin, proxyElement) {
                var _this2 = this;
                return proxyElement.getElement().then(function(element) {
                    var prerenderFrame = Object(src.p)({
                        attributes: Object(esm_extends.a)({
                            name: "__zoid_prerender_frame__" + _this2.component.name + "_" + Object(src.H)() + "__"
                        }, _this2.component.attributes.iframe),
                        class: [ CLASS.PRERENDER_FRAME, CLASS.VISIBLE ]
                    }, element);
                    return _this2.clean.register(function() {
                        return Object(src.i)(prerenderFrame);
                    }), Object(src.d)(prerenderFrame).then(function(prerenderFrameWindow) {
                        return Object(cross_domain_utils_src.b)(prerenderFrameWindow);
                    }).then(function(win) {
                        return {
                            proxyPrerenderWin: window_ProxyWindow.toProxyWindow(win),
                            proxyPrerenderFrame: getProxyElement(prerenderFrame)
                        };
                    });
                });
            },
            switchPrerender: function(_ref) {
                var proxyPrerenderFrame = _ref.proxyPrerenderFrame;
                return zalgo_promise_src.a.all([ _ref.proxyFrame.getElement(), proxyPrerenderFrame.getElement() ]).then(function(_ref2) {
                    var frame = _ref2[0], prerenderFrame = _ref2[1];
                    Object(src.a)(prerenderFrame, CLASS.INVISIBLE), Object(src.D)(prerenderFrame, CLASS.VISIBLE), 
                    Object(src.a)(frame, CLASS.VISIBLE), Object(src.D)(frame, CLASS.INVISIBLE), setTimeout(function() {
                        return Object(src.i)(prerenderFrame);
                    }, 1);
                });
            },
            delegate: [ "getProxyContainer", "renderContainer", "prerender", "switchPrerender", "open", "saveProxyWin" ],
            resize: function(_ref3) {
                this.proxyOutlet.resize({
                    width: _ref3.width,
                    height: _ref3.height
                });
            }
        }, RENDER_DRIVERS[CONTEXT.POPUP] = {
            renderedIntoContainer: !1,
            open: function() {
                var _this3 = this;
                return zalgo_promise_src.a.try(function() {
                    var _this3$component$dime = _this3.component.dimensions, width = _this3$component$dime.width, height = _this3$component$dime.height;
                    width = Object(src.z)(width, window.outerWidth), height = Object(src.z)(height, window.outerWidth);
                    var win = Object(src.C)("", Object(esm_extends.a)({
                        width: width,
                        height: height
                    }, _this3.component.attributes.popup));
                    return _this3.clean.register(function() {
                        win.close(), cleanUpWindow(win);
                    }), {
                        proxyWin: window_ProxyWindow.toProxyWindow(win)
                    };
                });
            },
            openPrerender: function(proxyWin) {
                return zalgo_promise_src.a.try(function() {
                    return {
                        proxyPrerenderWin: proxyWin
                    };
                });
            },
            delegate: [ "getProxyContainer", "renderContainer", "saveProxyWin" ]
        }, global_global.props = global_global.props || {}, global_global.windows = global_global.windows || {};
        var parent_ParentComponent = (_applyDecoratedDescriptor((parent_class = function() {
            function ParentComponent(component, props) {
                var _this = this;
                this.component = void 0, this.driver = void 0, this.clean = void 0, this.initPromise = void 0, 
                this.props = void 0, this.state = void 0, this.child = void 0, this.proxyWin = void 0, 
                this.proxyOutlet = void 0;
                try {
                    this.initPromise = new zalgo_promise_src.a(), this.clean = Object(src.g)(this), 
                    this.state = {}, this.component = component, this.setProps(props), this.component.registerActiveComponent(this), 
                    this.clean.register(function() {
                        return _this.component.destroyActiveComponent(_this);
                    }), this.watchForUnload();
                } catch (err) {
                    throw this.onError(err, props.onError).catch(src.y), err;
                }
            }
            var _proto = ParentComponent.prototype;
            return _proto.render = function(target, container, context) {
                var _this2 = this;
                return zalgo_promise_src.a.try(function() {
                    _this2.component.log("render"), _this2.driver = RENDER_DRIVERS[context];
                    var uid = _this2.component.tag + "-" + Object(src.H)(), domain = _this2.getDomain(), initialDomain = _this2.getInitialDomain();
                    _this2.component.checkAllowRender(target, domain, container), target !== window && _this2.delegate(context, target);
                    var tasks = {};
                    return tasks.init = _this2.initPromise, tasks.buildUrl = _this2.buildUrl(), tasks.onRender = _this2.props.onRender(), 
                    tasks.getProxyContainer = _this2.getProxyContainer(container), tasks.renderContainer = tasks.getProxyContainer.then(function(proxyContainer) {
                        return _this2.renderContainer(proxyContainer, {
                            context: context,
                            uid: uid
                        });
                    }), tasks.open = _this2.driver.renderedIntoContainer ? tasks.renderContainer.then(function(proxyOutlet) {
                        return _this2.open(proxyOutlet);
                    }) : _this2.open(), tasks.saveProxyWin = tasks.open.then(function(_ref) {
                        var proxyWin = _ref.proxyWin;
                        return _this2.proxyWin = proxyWin, _this2.saveProxyWin(proxyWin);
                    }), tasks.buildWindowName = tasks.open.then(function(_ref2) {
                        return _this2.buildWindowName({
                            proxyWin: _ref2.proxyWin,
                            initialDomain: initialDomain,
                            domain: domain,
                            target: target,
                            context: context,
                            uid: uid
                        });
                    }), tasks.setWindowName = zalgo_promise_src.a.all([ tasks.open, tasks.buildWindowName ]).then(function(_ref3) {
                        return _ref3[0].proxyWin.setName(_ref3[1]);
                    }), tasks.prerender = zalgo_promise_src.a.all([ tasks.open, tasks.renderContainer ]).then(function(_ref4) {
                        return _this2.prerender(_ref4[0].proxyWin, _ref4[1], {
                            context: context,
                            uid: uid
                        });
                    }), tasks.loadUrl = zalgo_promise_src.a.all([ tasks.open, tasks.buildUrl, tasks.setWindowName, tasks.prerender ]).then(function(_ref5) {
                        return _ref5[0].proxyWin.setLocation(_ref5[1]);
                    }), tasks.watchForClose = tasks.open.then(function(_ref6) {
                        return _this2.watchForClose(_ref6.proxyWin);
                    }), tasks.onDisplay = tasks.prerender.then(function() {
                        return _this2.props.onDisplay();
                    }), tasks.openBridge = tasks.open.then(function(_ref7) {
                        return _this2.openBridge(_ref7.proxyWin, initialDomain, context);
                    }), tasks.switchPrerender = zalgo_promise_src.a.all([ tasks.open, tasks.prerender, tasks.init ]).then(function(_ref8) {
                        return _this2.switchPrerender({
                            proxyFrame: _ref8[0].proxyFrame,
                            proxyPrerenderFrame: _ref8[1].proxyPrerenderFrame
                        });
                    }), tasks.runTimeout = tasks.loadUrl.then(function() {
                        return _this2.runTimeout();
                    }), tasks.onRender = tasks.init.then(function() {
                        return _this2.props.onRendered();
                    }), zalgo_promise_src.a.hash(tasks);
                }).catch(function(err) {
                    return zalgo_promise_src.a.all([ _this2.onError(err), _this2.destroy(err) ]);
                }).then(src.y);
            }, _proto.getProxyContainer = function(container) {
                return zalgo_promise_src.a.try(function() {
                    return Object(src.k)(container);
                }).then(function(containerElement) {
                    return getProxyElement(containerElement);
                });
            }, _proto.buildWindowName = function(_ref9) {
                var name, childPayload;
                return name = this.component.name, childPayload = this.buildChildPayload({
                    proxyWin: _ref9.proxyWin,
                    initialDomain: _ref9.initialDomain,
                    domain: _ref9.domain,
                    target: _ref9.target,
                    context: _ref9.context,
                    uid: _ref9.uid
                }), "__zoid__" + name + "__" + Object(src.f)(JSON.stringify(childPayload)) + "__";
            }, _proto.getPropsRef = function(proxyWin, target, domain, uid) {
                var value = serializeMessage(proxyWin, domain, this.getPropsForChild(domain)), propRef = Object(cross_domain_utils_src.s)(target) ? {
                    type: "raw",
                    value: value
                } : {
                    type: "uid",
                    uid: uid
                };
                return "uid" === propRef.type && (global_global.props[uid] = value, this.clean.register(function() {
                    delete global_global.props[uid];
                })), propRef;
            }, _proto.buildChildPayload = function(_temp2) {
                var _ref10 = void 0 === _temp2 ? {} : _temp2, proxyWin = _ref10.proxyWin, initialDomain = _ref10.initialDomain, domain = _ref10.domain, _ref10$target = _ref10.target, target = void 0 === _ref10$target ? window : _ref10$target, context = _ref10.context, uid = _ref10.uid;
                return {
                    uid: uid,
                    context: context,
                    domain: Object(cross_domain_utils_src.g)(window),
                    tag: this.component.tag,
                    parent: this.getWindowRef(target, initialDomain, uid, context),
                    props: this.getPropsRef(proxyWin, target, domain, uid),
                    exports: serializeMessage(proxyWin, domain, this.buildParentExports(proxyWin))
                };
            }, _proto.getHelpers = function() {
                var _this3 = this;
                return {
                    state: this.state,
                    close: function() {
                        return _this3.close();
                    },
                    focus: function() {
                        return _this3.focus();
                    },
                    resize: function(_ref11) {
                        return _this3.resize({
                            width: _ref11.width,
                            height: _ref11.height
                        });
                    },
                    onError: function(err) {
                        return _this3.onError(err);
                    },
                    updateProps: function(props) {
                        return _this3.updateProps(props);
                    }
                };
            }, _proto.setProps = function(props, isUpdate) {
                void 0 === isUpdate && (isUpdate = !1), this.component.validate && this.component.validate({
                    props: props
                });
                var helpers = this.getHelpers();
                this.props = this.props || {}, Object(src.l)(this.props, function(component, instance, props, helpers, isUpdate) {
                    void 0 === isUpdate && (isUpdate = !1), props = props || {};
                    for (var result = Object(esm_extends.a)({}, props), propNames = isUpdate ? [] : [].concat(component.getPropNames()), _i2 = 0, _Object$keys2 = Object.keys(props); _i2 < _Object$keys2.length; _i2++) {
                        var key = _Object$keys2[_i2];
                        -1 === propNames.indexOf(key) && propNames.push(key);
                    }
                    for (var aliases = [], state = helpers.state, close = helpers.close, focus = helpers.focus, onError = helpers.onError, _i4 = 0; _i4 < propNames.length; _i4++) {
                        var _key = propNames[_i4], propDef = component.getPropDefinition(_key), value = props[_key];
                        if (propDef) {
                            var alias = propDef.alias;
                            if (alias && (!Object(src.q)(value) && Object(src.q)(props[alias]) && (value = props[alias]), 
                            aliases.push(alias)), propDef.value && (value = propDef.value({
                                props: result,
                                state: state,
                                close: close,
                                focus: focus,
                                onError: onError
                            })), !Object(src.q)(value) && propDef.default && (value = propDef.default({
                                props: result,
                                state: state,
                                close: close,
                                focus: focus,
                                onError: onError
                            })), Object(src.q)(value) && ("array" === propDef.type ? !Array.isArray(value) : typeof value !== propDef.type)) throw new TypeError("Prop is not of type " + propDef.type + ": " + _key);
                            result[_key] = value;
                        }
                    }
                    for (var _i6 = 0; _i6 < aliases.length; _i6++) delete result[aliases[_i6]];
                    for (var _i8 = 0, _Object$keys4 = Object.keys(result); _i8 < _Object$keys4.length; _i8++) {
                        var _key2 = _Object$keys4[_i8], _propDef = component.getPropDefinition(_key2), _value = result[_key2];
                        _propDef && (Object(src.q)(_value) && _propDef.validate && _propDef.validate({
                            value: _value,
                            props: result
                        }), Object(src.q)(_value) && _propDef.decorate && (result[_key2] = _propDef.decorate({
                            value: _value,
                            props: result,
                            state: state,
                            close: close,
                            focus: focus,
                            onError: onError
                        })));
                    }
                    return result;
                }(this.component, 0, props, helpers, isUpdate));
                for (var _i2 = 0, _this$component$getPr2 = this.component.getPropNames(); _i2 < _this$component$getPr2.length; _i2++) {
                    var key = _this$component$getPr2[_i2];
                    if (!1 !== this.component.getPropDefinition(key).required && !Object(src.q)(this.props[key])) throw new Error('Expected prop "' + key + '" to be defined');
                }
            }, _proto.buildUrl = function() {
                var propsDef, props, params, _this4 = this;
                return (propsDef = Object(esm_extends.a)({}, this.component.props, this.component.builtinProps), 
                props = this.props, params = {}, zalgo_promise_src.a.all(Object.keys(props).map(function(key) {
                    var prop = propsDef[key];
                    if (prop) return zalgo_promise_src.a.resolve().then(function() {
                        var value = props[key];
                        if (value && prop.queryParam) return value;
                    }).then(function(value) {
                        if (null != value) return zalgo_promise_src.a.all([ getQueryParam(prop, key, value), getQueryValue(prop, 0, value) ]).then(function(_ref) {
                            var result, queryParam = _ref[0], queryValue = _ref[1];
                            if ("boolean" == typeof queryValue) result = queryValue.toString(); else if ("string" == typeof queryValue) result = queryValue.toString(); else if ("object" == typeof queryValue && null !== queryValue) {
                                if ("json" === prop.serialization) result = JSON.stringify(queryValue); else if ("base64" === prop.serialization) result = btoa(JSON.stringify(queryValue)); else if ("dotify" === prop.serialization || !prop.serialization) {
                                    result = Object(src.j)(queryValue, key);
                                    for (var _i10 = 0, _Object$keys6 = Object.keys(result); _i10 < _Object$keys6.length; _i10++) {
                                        var dotkey = _Object$keys6[_i10];
                                        params[dotkey] = result[dotkey];
                                    }
                                    return;
                                }
                            } else "number" == typeof queryValue && (result = queryValue.toString());
                            params[queryParam] = result;
                        });
                    });
                })).then(function() {
                    return params;
                })).then(function(query) {
                    return Object(src.m)(Object(cross_domain_utils_src.z)(_this4.component.getUrl(_this4.props)), {
                        query: query
                    });
                });
            }, _proto.getDomain = function() {
                return this.component.getDomain(this.props);
            }, _proto.getInitialDomain = function() {
                return this.component.getInitialDomain(this.props);
            }, _proto.getPropsForChild = function(domain) {
                for (var result = {}, _i4 = 0, _Object$keys2 = Object.keys(this.props); _i4 < _Object$keys2.length; _i4++) {
                    var key = _Object$keys2[_i4], prop = this.component.getPropDefinition(key);
                    prop && !1 === prop.sendToChild || prop && prop.sameDomain && !Object(cross_domain_utils_src.y)(domain, Object(cross_domain_utils_src.g)(window)) || (result[key] = this.props[key]);
                }
                return result;
            }, _proto.updateProps = function(props) {
                var _this5 = this;
                return this.setProps(props, !0), this.initPromise.then(function() {
                    if (_this5.child) return _this5.child.updateProps(_this5.getPropsForChild(_this5.getDomain()));
                });
            }, _proto.open = function(proxyOutlet) {
                var _this6 = this;
                return zalgo_promise_src.a.try(function() {
                    _this6.component.log("open");
                    var windowProp = _this6.props.window;
                    return windowProp ? (_this6.clean.register(function() {
                        return windowProp.close();
                    }), {
                        proxyWin: window_ProxyWindow.toProxyWindow(windowProp)
                    }) : _this6.driver.open.call(_this6, proxyOutlet);
                });
            }, _proto.saveProxyWin = function(proxyWin) {
                var _this7 = this;
                return zalgo_promise_src.a.try(function() {
                    _this7.proxyWin = proxyWin;
                });
            }, _proto.focus = function() {
                var _this8 = this;
                return zalgo_promise_src.a.try(function() {
                    if (_this8.proxyWin) return _this8.proxyWin.focus().then(src.y);
                });
            }, _proto.switchPrerender = function(_ref12) {
                var _this9 = this, proxyFrame = _ref12.proxyFrame, proxyPrerenderFrame = _ref12.proxyPrerenderFrame;
                return zalgo_promise_src.a.try(function() {
                    if (_this9.driver.switchPrerender) {
                        if (_this9.props.window) return;
                        if (!proxyFrame || !proxyPrerenderFrame) throw new Error("Expected to have both proxy frame and proxy prerender frame to switch");
                        return _this9.driver.switchPrerender.call(_this9, {
                            proxyFrame: proxyFrame,
                            proxyPrerenderFrame: proxyPrerenderFrame
                        });
                    }
                });
            }, _proto.delegate = function(context, target) {
                var _this10 = this;
                this.component.log("delegate");
                for (var props = {}, _i6 = 0, _this$component$getPr4 = this.component.getPropNames(); _i6 < _this$component$getPr4.length; _i6++) {
                    var propName = _this$component$getPr4[_i6];
                    this.component.getPropDefinition(propName).allowDelegate && (props[propName] = this.props[propName]);
                }
                for (var overridesPromise = _send(target, "zoid_delegate_" + this.component.name, {
                    context: context,
                    props: props,
                    overrides: {
                        close: function() {
                            return _this10.close();
                        },
                        onError: function(err) {
                            return _this10.onError(err);
                        }
                    }
                }).then(function(_ref13) {
                    var data = _ref13.data;
                    return _this10.clean.register(data.destroy), data.overrides;
                }).catch(function(err) {
                    throw new Error("Unable to delegate rendering. Possibly the component is not loaded in the target window.\n\n" + Object(src.F)(err));
                }), _loop = function(_i8, _this$driver$delegate2) {
                    var key = _this$driver$delegate2[_i8];
                    _this10[key] = function() {
                        var _this11 = this, _arguments = arguments;
                        return overridesPromise.then(function(overrides) {
                            return overrides[key].apply(_this11, _arguments);
                        });
                    };
                }, _i8 = 0, _this$driver$delegate2 = this.driver.delegate; _i8 < _this$driver$delegate2.length; _i8++) _loop(_i8, _this$driver$delegate2);
            }, _proto.getWindowRef = function(target, domain, uid, context) {
                return domain === Object(cross_domain_utils_src.g)(window) ? (global_global.windows[uid] = window, 
                this.clean.register(function() {
                    delete global_global.windows[uid];
                }), {
                    type: "global",
                    uid: uid
                }) : context === CONTEXT.POPUP ? {
                    type: "opener"
                } : Object(cross_domain_utils_src.u)(window) ? {
                    type: "top"
                } : {
                    type: "parent",
                    distance: Object(cross_domain_utils_src.f)(window)
                };
            }, _proto.watchForClose = function(proxyWin) {
                var _this12 = this;
                return proxyWin.awaitWindow().then(function(win) {
                    var closeWindowListener = Object(cross_domain_utils_src.A)(win, function() {
                        return _this12.component.log("detect_close_child"), _this12.close();
                    }, 2e3);
                    _this12.clean.register(closeWindowListener.cancel);
                });
            }, _proto.watchForUnload = function() {
                var _this13 = this, unloadWindowListener = Object(src.b)(window, "unload", Object(src.B)(function() {
                    _this13.component.log("navigate_away"), _this13.destroy(new Error("Window navigated away"));
                }));
                this.clean.register(unloadWindowListener.cancel);
            }, _proto.runTimeout = function() {
                var _this14 = this;
                return zalgo_promise_src.a.try(function() {
                    var timeout = _this14.props.timeout;
                    if (timeout) return _this14.initPromise.timeout(timeout, new Error("Loading component timed out after " + timeout + " milliseconds"));
                });
            }, _proto.initChild = function(child) {
                var _this15 = this;
                return zalgo_promise_src.a.try(function() {
                    _this15.clean.set("child", child), _this15.initPromise.resolve();
                });
            }, _proto.buildParentExports = function(win) {
                var _this16 = this, onError = function(err) {
                    return _this16.onError(err);
                }, init = function(child) {
                    return _this16.initChild(child);
                };
                return init.onError = onError, {
                    init: init,
                    close: function() {
                        return _this16.close();
                    },
                    checkClose: function() {
                        return _this16.checkClose(win);
                    },
                    resize: function(_ref14) {
                        return _this16.resize({
                            width: _ref14.width,
                            height: _ref14.height
                        });
                    },
                    onError: onError
                };
            }, _proto.resize = function(_ref15) {
                var _this17 = this, width = _ref15.width, height = _ref15.height;
                return zalgo_promise_src.a.try(function() {
                    if (_this17.driver.resize) return _this17.driver.resize.call(_this17, {
                        width: width,
                        height: height
                    });
                });
            }, _proto.checkClose = function(win) {
                var _this18 = this;
                return win.isClosed().then(function(closed) {
                    return closed ? _this18.close() : zalgo_promise_src.a.delay(200).then(function() {
                        return win.isClosed();
                    }).then(function(secondClosed) {
                        if (secondClosed) return _this18.close();
                    });
                });
            }, _proto.close = function() {
                var _this19 = this;
                return zalgo_promise_src.a.try(function() {
                    return _this19.component.log("close"), _this19.props.onClose();
                }).then(function() {
                    return _this19.child && _this19.child.close.fireAndForget().catch(src.y), _this19.destroy(new Error("Window closed"));
                });
            }, _proto.prerender = function(proxyWin, proxyElement, _ref16) {
                var _this20 = this, context = _ref16.context, uid = _ref16.uid;
                return zalgo_promise_src.a.try(function() {
                    return _this20.driver.openPrerender.call(_this20, proxyWin, proxyElement);
                }).then(function(_ref17) {
                    var proxyPrerenderWin = _ref17.proxyPrerenderWin, proxyPrerenderFrame = _ref17.proxyPrerenderFrame, prerenderWindow = proxyPrerenderWin.getWindow();
                    if (!prerenderWindow || !Object(cross_domain_utils_src.s)(prerenderWindow) || !Object(cross_domain_utils_src.q)(prerenderWindow)) return {
                        proxyPrerenderWin: proxyPrerenderWin,
                        proxyPrerenderFrame: proxyPrerenderFrame
                    };
                    var doc = (prerenderWindow = Object(cross_domain_utils_src.b)(prerenderWindow)).document, el = _this20.renderTemplate(_this20.component.prerenderTemplate, {
                        context: context,
                        uid: uid,
                        doc: doc
                    });
                    if (el.ownerDocument !== doc) throw new Error("Expected prerender template to have been created with document from child window");
                    Object(src.N)(prerenderWindow, el);
                    var _ref18 = _this20.component.autoResize || {}, _ref18$width = _ref18.width, width = void 0 !== _ref18$width && _ref18$width, _ref18$height = _ref18.height, height = void 0 !== _ref18$height && _ref18$height, _ref18$element = _ref18.element, element = void 0 === _ref18$element ? "body" : _ref18$element;
                    return (element = Object(src.n)(element, doc)) && (width || height) && Object(src.A)(element, function(_ref19) {
                        _this20.resize({
                            width: width ? _ref19.width : void 0,
                            height: height ? _ref19.height : void 0
                        });
                    }, {
                        width: width,
                        height: height,
                        win: prerenderWindow
                    }), {
                        proxyPrerenderWin: proxyPrerenderWin,
                        proxyPrerenderFrame: proxyPrerenderFrame
                    };
                });
            }, _proto.renderTemplate = function(renderer, _ref20) {
                var _this21 = this;
                return renderer.call(this, {
                    container: _ref20.container,
                    outlet: _ref20.outlet,
                    context: _ref20.context,
                    uid: _ref20.uid,
                    doc: _ref20.doc,
                    focus: function() {
                        return _this21.focus();
                    },
                    close: function() {
                        return _this21.close();
                    },
                    state: this.state,
                    props: this.props,
                    tag: this.component.tag,
                    dimensions: this.component.dimensions
                });
            }, _proto.renderContainer = function(proxyContainer, _ref21) {
                var _this22 = this, context = _ref21.context, uid = _ref21.uid;
                return zalgo_promise_src.a.try(function() {
                    return proxyContainer.getElement();
                }).then(function(element) {
                    return Object(src.k)(element);
                }).then(function(container) {
                    var outlet = Object(src.h)("div", {
                        class: [ CLASS.OUTLET ]
                    }), innerContainer = _this22.renderTemplate(_this22.component.containerTemplate, {
                        context: context,
                        uid: uid,
                        container: container,
                        outlet: outlet,
                        doc: document
                    });
                    return Object(src.c)(container, innerContainer), _this22.clean.register(function() {
                        return Object(src.i)(outlet);
                    }), _this22.clean.register(function() {
                        return Object(src.i)(innerContainer);
                    }), _this22.proxyOutlet = getProxyElement(outlet), _this22.proxyOutlet;
                });
            }, _proto.destroy = function(err) {
                var _this23 = this;
                return void 0 === err && (err = new Error("Component destroyed before render complete")), 
                zalgo_promise_src.a.try(function() {
                    return _this23.component.log("destroy"), _this23.initPromise.asyncReject(err), _this23.clean.all();
                });
            }, _proto.onError = function(err, _onError) {
                var _this24 = this;
                return zalgo_promise_src.a.try(function() {
                    if (_this24.initPromise.asyncReject(err), !_onError && _this24.props && _this24.props.onError && (_onError = _this24.props.onError), 
                    _onError) return _onError(err);
                }).then(function() {
                    return _this24.initPromise;
                }).then(function() {
                    throw err;
                });
            }, _proto.openBridge = function(proxyWin, domain, context) {
                var _this25 = this;
                return zalgo_promise_src.a.try(function() {
                    return proxyWin.awaitWindow();
                }).then(function(win) {
                    if (bridge && bridge.needsBridge({
                        win: win,
                        domain: domain
                    }) && !bridge.hasBridge(domain, domain)) {
                        var bridgeUrl = _this25.component.getBridgeUrl();
                        if (!bridgeUrl) throw new Error("Bridge needed to render " + context);
                        var bridgeDomain = Object(cross_domain_utils_src.h)(bridgeUrl);
                        return bridge.linkUrl(win, domain), bridge.openBridge(Object(cross_domain_utils_src.z)(bridgeUrl), bridgeDomain);
                    }
                });
            }, ParentComponent;
        }()).prototype, "close", [ src.x ], Object.getOwnPropertyDescriptor(parent_class.prototype, "close"), parent_class.prototype), 
        parent_class), delegate_DelegateComponent = function() {
            function DelegateComponent(component, source, options) {
                var _this = this;
                this.component = void 0, this.source = void 0, this.context = void 0, this.driver = void 0, 
                this.props = void 0, this.clean = void 0, this.close = void 0, this.onError = void 0, 
                this.focus = void 0, this.component = component, this.context = options.context, 
                this.driver = RENDER_DRIVERS[options.context], this.clean = Object(src.g)(this), 
                this.focus = parent_ParentComponent.prototype.focus, this.resize = parent_ParentComponent.prototype.resize, 
                this.renderTemplate = parent_ParentComponent.prototype.renderTemplate, this.props = {};
                for (var _i2 = 0, _Object$keys2 = Object.keys(options.props); _i2 < _Object$keys2.length; _i2++) {
                    var propName = _Object$keys2[_i2];
                    options.props[propName] && this.component.getPropDefinition(propName) && this.component.getPropDefinition(propName).allowDelegate && (this.props[propName] = options.props[propName]);
                }
                this.close = options.overrides.close, this.onError = options.overrides.onError, 
                this.component.registerActiveComponent(this), this.clean.register(function() {
                    return _this.component.destroyActiveComponent(_this);
                }), this.watchForSourceClose(source);
            }
            var _proto = DelegateComponent.prototype;
            return _proto.getDelegate = function() {
                var _this2 = this;
                return {
                    overrides: this.getOverrides(),
                    destroy: function() {
                        return _this2.destroy();
                    }
                };
            }, _proto.watchForSourceClose = function(source) {
                var _this3 = this, closeSourceWindowListener = Object(cross_domain_utils_src.A)(source, function() {
                    return _this3.destroy();
                }, 3e3);
                this.clean.register(closeSourceWindowListener.cancel);
            }, _proto.getOverrides = function() {
                for (var overrides = {}, self = this, _loop = function(_i4, _this$driver$delegate2) {
                    var key = _this$driver$delegate2[_i4];
                    overrides[key] = function() {
                        return parent_ParentComponent.prototype[key].apply(self, arguments);
                    };
                }, _i4 = 0, _this$driver$delegate2 = this.driver.delegate; _i4 < _this$driver$delegate2.length; _i4++) _loop(_i4, _this$driver$delegate2);
                return overrides;
            }, _proto.destroy = function() {
                return this.clean.all();
            }, DelegateComponent;
        }();
        function _inheritsLoose(subClass, superClass) {
            subClass.prototype = Object.create(superClass.prototype), subClass.prototype.constructor = subClass, 
            subClass.__proto__ = superClass;
        }
        var Node = function() {
            function Node() {}
            var _proto = Node.prototype;
            return _proto.isElementNode = function() {
                return !1;
            }, _proto.isTextNode = function() {
                return !1;
            }, _proto.isFragmentNode = function() {
                return !1;
            }, Node;
        }(), node_ElementNode = function(_Node) {
            function ElementNode(name, props, children) {
                var _this;
                return (_this = _Node.call(this) || this).name = void 0, _this.props = void 0, _this.children = void 0, 
                _this.onRender = void 0, _this.name = name, _this.props = props, _this.children = children, 
                "function" == typeof props.onRender && (_this.onRender = props.onRender, delete props.onRender), 
                _this;
            }
            _inheritsLoose(ElementNode, _Node);
            var _proto2 = ElementNode.prototype;
            return _proto2.getTag = function() {
                return this.name;
            }, _proto2.isTag = function(name) {
                return name === this.name;
            }, _proto2.isElementNode = function() {
                return !0;
            }, _proto2.render = function(renderer) {
                var element = renderer(this.name, this.props, this.children);
                return this.onRender && this.onRender(element), element;
            }, _proto2.getText = function() {
                throw new Error("Can not get text of an element node");
            }, ElementNode;
        }(Node), node_TextNode = function(_Node2) {
            function TextNode(text) {
                var _this2;
                return (_this2 = _Node2.call(this) || this).text = void 0, _this2.text = text, _this2;
            }
            _inheritsLoose(TextNode, _Node2);
            var _proto3 = TextNode.prototype;
            return _proto3.getTag = function() {
                throw new Error("Can not get tag of text node");
            }, _proto3.isTag = function(name) {
                throw new Error("Can not check tag of text node");
            }, _proto3.isTextNode = function() {
                return !0;
            }, _proto3.render = function(renderer) {
                throw new Error("Can not render a text node");
            }, _proto3.getText = function() {
                return this.text;
            }, TextNode;
        }(Node), node_FragmentNode = function(_Node3) {
            function FragmentNode(children) {
                var _this3;
                return (_this3 = _Node3.call(this) || this).children = void 0, _this3.children = children, 
                _this3;
            }
            _inheritsLoose(FragmentNode, _Node3);
            var _proto4 = FragmentNode.prototype;
            return _proto4.getTag = function() {
                throw new Error("Can not get tag of fragment node");
            }, _proto4.isTag = function(name) {
                throw new Error("Can not check tag of fragment node");
            }, _proto4.isFragmentNode = function() {
                return !0;
            }, _proto4.render = function(renderer) {
                throw new Error("Can not render a fragment node");
            }, _proto4.getText = function() {
                throw new Error("Can not get text of a fragment node");
            }, FragmentNode;
        }(Node);
        function normalizeChild(child) {
            if ("string" == typeof child) return new node_TextNode(child);
            if (child instanceof node_ElementNode || child instanceof node_TextNode || child instanceof node_FragmentNode) return child;
            if (Array.isArray(child)) return new node_FragmentNode(normalizeChildren(child));
            if (null != child) throw new Error("Child node must be string or instance of jsx-pragmatic node; got " + typeof child);
        }
        function normalizeChildren(children) {
            for (var result = [], _i2 = 0; _i2 < children.length; _i2++) {
                var normalizedChild = normalizeChild(children[_i2]);
                if (normalizedChild) if (normalizedChild instanceof node_FragmentNode) for (var _i4 = 0, _normalizedChild$chil2 = normalizedChild.children; _i4 < _normalizedChild$chil2.length; _i4++) result.push(_normalizedChild$chil2[_i4]); else result.push(normalizedChild);
            }
            return result;
        }
        var _CREATE_ELEMENT, _ADD_CHILDREN, component_class, _class2, component_temp, node = function(element, props) {
            for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) children[_key - 2] = arguments[_key];
            if ("string" == typeof element) return new node_ElementNode(element, props || {}, normalizeChildren(children));
            if ("function" == typeof element) return normalizeChild(element(props || {}, normalizeChildren(children)));
            throw new TypeError("Expected jsx Element to be a string or a function");
        }, ELEMENT_TAG_HTML = "html", ELEMENT_TAG_IFRAME = "iframe", ELEMENT_TAG_SCRIPT = "script", ELEMENT_TAG_NODE = "node", ELEMENT_TAG_DEFAULT = "default", ELEMENT_PROP_ID = "id", ELEMENT_PROP_INNER_HTML = "innerHTML", ELEMENT_PROP_EL = "el", CREATE_ELEMENT = ((_CREATE_ELEMENT = {})[ELEMENT_TAG_NODE] = function(_ref) {
            var props = _ref.props;
            if (!props[ELEMENT_PROP_EL]) throw new Error("Must pass " + ELEMENT_PROP_EL + " prop to " + ELEMENT_TAG_NODE + " element");
            if (Object.keys(props).length > 1) throw new Error("Must not pass any prop other than " + ELEMENT_PROP_EL + " to " + ELEMENT_TAG_NODE + " element");
            return props[ELEMENT_PROP_EL];
        }, _CREATE_ELEMENT[ELEMENT_TAG_DEFAULT] = function(_ref2) {
            return _ref2.doc.createElement(_ref2.name);
        }, _CREATE_ELEMENT), ADD_CHILDREN = ((_ADD_CHILDREN = {})[ELEMENT_TAG_IFRAME] = function(_ref5) {
            var el = _ref5.el, children = _ref5.children, firstChild = children[0];
            if (children.length > 1 || !firstChild.isElementNode()) throw new Error("Expected only single element node as child of " + ELEMENT_TAG_IFRAME + " element");
            if (!firstChild.isTag(ELEMENT_TAG_HTML)) throw new Error("Expected element to be inserted into frame to be html, got " + firstChild.getTag());
            el.addEventListener("load", function() {
                var win = el.contentWindow;
                if (!win) throw new Error("Expected frame to have contentWindow");
                for (var doc = win.document, docElement = doc.documentElement; docElement.children && docElement.children.length; ) docElement.removeChild(docElement.children[0]);
                for (var child = firstChild.render(dom_dom({
                    doc: doc
                })); child.children.length; ) docElement.appendChild(child.children[0]);
            });
        }, _ADD_CHILDREN[ELEMENT_TAG_SCRIPT] = function(_ref6) {
            var el = _ref6.el, children = _ref6.children, firstChild = children[0];
            if (1 !== children.length || !firstChild.isTextNode()) throw new Error("Expected only single text node as child of " + ELEMENT_TAG_SCRIPT + " element");
            el.text = firstChild.getText();
        }, _ADD_CHILDREN[ELEMENT_TAG_DEFAULT] = function(_ref7) {
            for (var el = _ref7.el, children = _ref7.children, doc = _ref7.doc, domRenderer = _ref7.domRenderer, _i6 = 0; _i6 < children.length; _i6++) {
                var child = children[_i6];
                child.isTextNode() ? el.appendChild(doc.createTextNode(child.getText())) : el.appendChild(child.render(domRenderer));
            }
        }, _ADD_CHILDREN), dom_dom = function(_temp) {
            var _ref9$doc = (void 0 === _temp ? {} : _temp).doc, doc = void 0 === _ref9$doc ? document : _ref9$doc;
            return function domRenderer(name, props, children) {
                var el = function(_ref3) {
                    var name = _ref3.name;
                    return (CREATE_ELEMENT[name] || CREATE_ELEMENT[ELEMENT_TAG_DEFAULT])({
                        name: name,
                        props: _ref3.props,
                        doc: _ref3.doc
                    });
                }({
                    name: name,
                    props: props,
                    doc: doc
                });
                return function(_ref4) {
                    for (var el = _ref4.el, props = _ref4.props, _i4 = 0, _Object$keys2 = Object.keys(props); _i4 < _Object$keys2.length; _i4++) {
                        var prop = _Object$keys2[_i4], val = props[prop];
                        if (null != val && prop !== ELEMENT_PROP_EL && prop !== ELEMENT_PROP_INNER_HTML) if (prop.match(/^on[A-Z][a-z]/) && "function" == typeof val) el.addEventListener(prop.slice(2).toLowerCase(), val); else if ("string" == typeof val || "number" == typeof val) el.setAttribute(prop, val.toString()); else {
                            if ("boolean" != typeof val) throw new TypeError("Can not render prop " + prop + " of type " + typeof val);
                            !0 === val && el.setAttribute(prop, "");
                        }
                    }
                    el.tagName.toLowerCase() !== ELEMENT_TAG_IFRAME || props.id || el.setAttribute(ELEMENT_PROP_ID, "jsx-iframe-" + "xxxxxxxxxx".replace(/./g, function() {
                        return "0123456789abcdef".charAt(Math.floor(Math.random() * "0123456789abcdef".length));
                    }));
                }({
                    el: el,
                    props: props
                }), function(_ref8) {
                    var el = _ref8.el, name = _ref8.name, props = _ref8.props, children = _ref8.children, doc = _ref8.doc, domRenderer = _ref8.domRenderer;
                    if (props.hasOwnProperty(ELEMENT_PROP_INNER_HTML)) {
                        if (children.length >= 1) throw new Error("Expected no children to be passed when " + ELEMENT_PROP_INNER_HTML + " prop is set");
                        var html = props[ELEMENT_PROP_INNER_HTML];
                        if ("string" != typeof html) throw new TypeError(ELEMENT_PROP_INNER_HTML + " prop must be string");
                        name === ELEMENT_TAG_SCRIPT ? el.text = html : (el.innerHTML = html, function(el, doc) {
                            void 0 === doc && (doc = window.document);
                            for (var _i2 = 0, _el$querySelectorAll2 = el.querySelectorAll("script"); _i2 < _el$querySelectorAll2.length; _i2++) {
                                var script = _el$querySelectorAll2[_i2], parentNode = script.parentNode;
                                if (parentNode) {
                                    var newScript = doc.createElement("script");
                                    newScript.text = script.textContent, parentNode.replaceChild(newScript, script);
                                }
                            }
                        }(el, doc));
                    } else (ADD_CHILDREN[name] || ADD_CHILDREN[ELEMENT_TAG_DEFAULT])({
                        el: el,
                        name: name,
                        props: props,
                        children: children,
                        doc: doc,
                        domRenderer: domRenderer
                    });
                }({
                    el: el,
                    name: name,
                    props: props,
                    children: children,
                    doc: doc,
                    domRenderer: domRenderer
                }), el;
            };
        };
        function defaultContainerTemplate(_ref) {
            var uid = _ref.uid, outlet = _ref.outlet, doc = _ref.doc, _ref$dimensions = _ref.dimensions;
            return node("div", {
                id: uid
            }, node("style", null, "\n                    #" + uid + " > ." + CLASS.OUTLET + " {\n                        width: " + _ref$dimensions.width + ";\n                        height: " + _ref$dimensions.height + ";\n                        display: inline-block;\n                        position: relative;\n                    }\n\n                    #" + uid + " > ." + CLASS.OUTLET + " > iframe {\n                        height: 100%;\n                        width: 100%;\n                        position: absolute;\n                        top: 0;\n                        left: 0;\n                        transition: opacity .2s ease-in-out;\n                    }\n\n                    #" + uid + " > ." + CLASS.OUTLET + " > iframe." + CLASS.VISIBLE + " {\n                        opacity: 1;\n                    }\n\n                    #" + uid + " > ." + CLASS.OUTLET + " > iframe." + CLASS.INVISIBLE + " {\n                        opacity: 0;\n                    }\n                "), node("node", {
                el: outlet
            })).render(dom_dom({
                doc: doc
            }));
        }
        function defaultPrerenderTemplate(_ref) {
            var doc = _ref.doc;
            return node("html", null, node("head", null, node("style", null, "\n                        html, body {\n                            width: 100%;\n                            height: 100%;\n                            overflow: hidden;\n                            top: 0;\n                            left: 0;\n                            margin: 0;\n                            text-align: center;\n                        }\n\n                        .spinner {\n                            position: absolute;\n                            max-height: 60vmin;\n                            max-width: 60vmin;\n                            height: 40px;\n                            width: 40px;\n                            top: 50%;\n                            left: 50%;\n                            transform: translateX(-50%) translateY(-50%);\n                            z-index: 10;\n                        }\n\n                        .spinner .loader {\n                            height: 100%;\n                            width: 100%;\n                            box-sizing: border-box;\n                            border: 3px solid rgba(0, 0, 0, .2);\n                            border-top-color: rgba(33, 128, 192, 0.8);\n                            border-radius: 100%;\n                            animation: rotation .7s infinite linear;\n\n                        }\n\n                        @keyframes rotation {\n                            from {\n                                transform: rotate(0deg)\n                            }\n                            to {\n                                transform: rotate(359deg)\n                            }\n                        }\n                    ")), node("body", null, node("div", {
                class: "spinner"
            }, node("div", {
                id: "loader",
                class: "loader"
            })))).render(dom_dom({
                doc: doc
            }));
        }
        var component, init, drivers = {}, component_Component = (component_temp = _class2 = function() {
            function Component(options) {
                if (this.tag = void 0, this.name = void 0, this.url = void 0, this.domain = void 0, 
                this.bridgeUrl = void 0, this.props = void 0, this.builtinProps = void 0, this.dimensions = void 0, 
                this.autoResize = void 0, this.allowedParentDomains = void 0, this.defaultContext = void 0, 
                this.attributes = void 0, this.containerTemplate = void 0, this.prerenderTemplate = void 0, 
                this.validate = void 0, this.driverCache = void 0, this.xprops = void 0, this.logger = void 0, 
                function(options) {
                    if (!options) throw new Error("Expected options to be passed");
                    if (!options.tag || !options.tag.match(/^([a-z0-9]+-)+[a-z0-9]+$/)) throw new Error("Invalid options.tag: " + options.tag);
                    if (function(options) {
                        if (options.props && "object" != typeof options.props) throw new Error("Expected options.props to be an object");
                        var PROP_TYPE_LIST = Object(src.I)(PROP_TYPE);
                        if (options.props) for (var _i2 = 0, _Object$keys2 = Object.keys(options.props); _i2 < _Object$keys2.length; _i2++) {
                            var key = _Object$keys2[_i2], prop = options.props[key];
                            if (!prop || "object" != typeof prop) throw new Error("Expected options.props." + key + " to be an object");
                            if (!prop.type) throw new Error("Expected prop.type");
                            if (-1 === PROP_TYPE_LIST.indexOf(prop.type)) throw new Error("Expected prop.type to be one of " + PROP_TYPE_LIST.join(", "));
                            if (prop.required && prop.default) throw new Error("Required prop can not have a default value");
                            if (prop.type === PROP_TYPE.FUNCTION && prop.queryParam && !prop.queryValue) throw new Error("Do not pass queryParam for function prop");
                        }
                    }(options), options.dimensions) {
                        if (options.dimensions && !Object(src.t)(options.dimensions.width) && !Object(src.s)(options.dimensions.width)) throw new Error("Expected options.dimensions.width to be a px or % string value");
                        if (options.dimensions && !Object(src.t)(options.dimensions.height) && !Object(src.s)(options.dimensions.height)) throw new Error("Expected options.dimensions.height to be a px or % string value");
                    }
                    if (options.defaultContext && options.defaultContext !== CONTEXT.IFRAME && options.defaultContext !== CONTEXT.POPUP) throw new Error("Unsupported context type: " + (options.defaultContext || "unknown"));
                    if (!options.url) throw new Error("Must pass url");
                    if ("string" != typeof options.url && "function" != typeof options.url) throw new TypeError("Expected url to be string or function");
                    if (options.prerenderTemplate && "function" != typeof options.prerenderTemplate) throw new Error("Expected options.prerenderTemplate to be a function");
                    if (options.containerTemplate && "function" != typeof options.containerTemplate) throw new Error("Expected options.containerTemplate to be a function");
                }(options), this.tag = options.tag, this.name = this.tag.replace(/-/g, "_"), this.allowedParentDomains = options.allowedParentDomains || WILDCARD, 
                Component.components[this.tag]) throw new Error("Can not register multiple components with the same tag: " + this.tag);
                this.builtinProps = {
                    window: {
                        type: "object",
                        sendToChild: !1,
                        required: !1,
                        allowDelegate: !0,
                        validate: function(_ref) {
                            var value = _ref.value;
                            if (!Object(cross_domain_utils_src.v)(value) && !window_ProxyWindow.isProxyWindow(value)) throw new Error("Expected Window or ProxyWindow");
                        },
                        decorate: function(_ref2) {
                            return window_ProxyWindow.toProxyWindow(_ref2.value);
                        }
                    },
                    timeout: {
                        type: "number",
                        required: !1,
                        sendToChild: !1
                    },
                    close: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        childDecorate: function(_ref3) {
                            return _ref3.close;
                        }
                    },
                    focus: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        childDecorate: function(_ref4) {
                            return _ref4.focus;
                        }
                    },
                    resize: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        childDecorate: function(_ref5) {
                            return _ref5.resize;
                        }
                    },
                    onDisplay: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        allowDelegate: !0,
                        default: function() {
                            return src.y;
                        },
                        decorate: function(_ref6) {
                            var value = _ref6.value;
                            return Object(src.B)(value);
                        }
                    },
                    onRendered: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        default: function() {
                            return src.y;
                        },
                        decorate: function(_ref7) {
                            var value = _ref7.value;
                            return Object(src.B)(value);
                        }
                    },
                    onRender: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        default: function() {
                            return src.y;
                        },
                        decorate: function(_ref8) {
                            var value = _ref8.value;
                            return Object(src.B)(value);
                        }
                    },
                    onClose: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        allowDelegate: !0,
                        default: function() {
                            return src.y;
                        },
                        decorate: function(_ref9) {
                            var value = _ref9.value;
                            return Object(src.B)(value);
                        }
                    },
                    onError: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        childDecorate: function(_ref10) {
                            var onError = _ref10.onError;
                            return function(err) {
                                return onError(err);
                            };
                        }
                    },
                    onChange: {
                        type: "function",
                        required: !1,
                        sendToChild: !1,
                        childDecorate: function(_ref11) {
                            return _ref11.onPropsChange;
                        }
                    }
                }, this.props = options.props || {};
                var _ref = options.dimensions || {}, _ref$width = _ref.width, _ref$height = _ref.height;
                this.dimensions = {
                    width: void 0 === _ref$width ? DEFAULT_DIMENSIONS.WIDTH : _ref$width,
                    height: void 0 === _ref$height ? DEFAULT_DIMENSIONS.HEIGHT : _ref$height
                }, this.url = options.url, this.domain = options.domain, this.bridgeUrl = options.bridgeUrl, 
                this.attributes = options.attributes || {}, this.attributes.iframe = this.attributes.iframe || {}, 
                this.attributes.popup = this.attributes.popup || {}, this.defaultContext = options.defaultContext || CONTEXT.IFRAME, 
                this.autoResize = options.autoResize, this.containerTemplate = options.containerTemplate || defaultContainerTemplate, 
                this.prerenderTemplate = options.prerenderTemplate || defaultPrerenderTemplate, 
                this.validate = options.validate, this.logger = options.logger || {
                    debug: src.y,
                    info: src.y,
                    warn: src.y,
                    error: src.y
                }, this.registerChild(), this.listenDelegate(), Component.components[this.tag] = this;
            }
            var _proto = Component.prototype;
            return _proto.getPropNames = function() {
                for (var props = Object.keys(this.props), _i2 = 0, _Object$keys2 = Object.keys(this.builtinProps); _i2 < _Object$keys2.length; _i2++) {
                    var key = _Object$keys2[_i2];
                    -1 === props.indexOf(key) && props.push(key);
                }
                return props;
            }, _proto.getPropDefinition = function(name) {
                return this.props[name] || this.builtinProps[name];
            }, _proto.driver = function(name, dep) {
                if (!drivers[name]) throw new Error("Could not find driver for framework: " + name);
                return this.driverCache = this.driverCache || {}, this.driverCache[name] || (this.driverCache[name] = drivers[name].register(this, dep)), 
                this.driverCache[name];
            }, _proto.registerChild = function() {
                if (this.isChild()) {
                    if (window.xprops) throw new Error("Can not register " + this.name + " as child - can not attach multiple components to the same window");
                    var child = new child_ChildComponent(this);
                    window.xprops = this.xprops = child.getProps();
                }
            }, _proto.listenDelegate = function() {
                var _this = this;
                _on("zoid_allow_delegate_" + this.name, function() {
                    return !0;
                }), _on("zoid_delegate_" + this.name, function(_ref2) {
                    var _ref2$data = _ref2.data;
                    return new delegate_DelegateComponent(_this, _ref2.source, {
                        context: _ref2$data.context,
                        props: _ref2$data.props,
                        overrides: _ref2$data.overrides
                    }).getDelegate();
                });
            }, _proto.canRenderTo = function(win) {
                return _send(win, "zoid_allow_delegate_" + this.name).then(function(_ref3) {
                    return _ref3.data;
                }).catch(function() {
                    return !1;
                });
            }, _proto.getUrl = function(props) {
                return "function" == typeof this.url ? this.url({
                    props: props
                }) : this.url;
            }, _proto.getInitialDomain = function(props) {
                return this.domain && "string" == typeof this.domain ? this.domain : Object(cross_domain_utils_src.h)(this.getUrl(props));
            }, _proto.getDomain = function(props) {
                return Object(src.u)(this.domain) ? this.domain : this.getInitialDomain(props);
            }, _proto.getBridgeUrl = function() {
                if (this.bridgeUrl) return this.bridgeUrl;
            }, _proto.isChild = function() {
                return isZoidComponentWindow() && parseChildWindowName().tag === this.tag;
            }, _proto.getDefaultContainer = function(context, container) {
                if (container) {
                    if ("string" != typeof container && !Object(src.r)(container)) throw new TypeError("Expected string or element selector to be passed");
                    return container;
                }
                if (context === CONTEXT.POPUP) return "body";
                throw new Error("Expected element to be passed to render iframe");
            }, _proto.getDefaultContext = function(context, props) {
                if (props.window) return window_ProxyWindow.toProxyWindow(props.window).getType();
                if (context) {
                    if (context !== CONTEXT.IFRAME && context !== CONTEXT.POPUP) throw new Error("Unrecognized context: " + context);
                    return context;
                }
                return this.defaultContext;
            }, _proto.init = function(props) {
                var _this2 = this, parent = new parent_ParentComponent(this, props = props || {}), _render = function(target, container, context) {
                    return zalgo_promise_src.a.try(function() {
                        if (!Object(cross_domain_utils_src.v)(target)) throw new Error("Must pass window to renderTo");
                        return context = _this2.getDefaultContext(context, props), container = _this2.getDefaultContainer(context, container), 
                        parent.render(target, container, context);
                    });
                };
                return Object(esm_extends.a)({}, parent.getHelpers(), {
                    render: function(container, context) {
                        return _render(window, container, context);
                    },
                    renderTo: function(target, container, context) {
                        return _render(target, container, context);
                    }
                });
            }, _proto.checkAllowRender = function(target, domain, container) {
                if (target !== window) {
                    if (!Object(cross_domain_utils_src.t)(window, target)) throw new Error("Can only renderTo an adjacent frame");
                    var origin = Object(cross_domain_utils_src.g)();
                    if (!Object(cross_domain_utils_src.y)(domain, origin) && !Object(cross_domain_utils_src.s)(target)) throw new Error("Can not render remotely to " + domain.toString() + " - can only render to " + origin);
                    if (container && "string" != typeof container) throw new Error("Container passed to renderTo must be a string selector, got " + typeof container + " }");
                }
            }, _proto.log = function(event, payload) {
                this.logger.info(this.name + "_" + event, payload);
            }, _proto.registerActiveComponent = function(instance) {
                Component.activeComponents.push(instance);
            }, _proto.destroyActiveComponent = function(instance) {
                Component.activeComponents.splice(Component.activeComponents.indexOf(instance), 1);
            }, Component.destroyAll = function() {
                bridge && bridge.destroyBridges();
                for (var results = []; Component.activeComponents.length; ) results.push(Component.activeComponents[0].destroy());
                return zalgo_promise_src.a.all(results).then(src.y);
            }, Component;
        }(), _class2.components = {}, _class2.activeComponents = [], _applyDecoratedDescriptor((component_class = component_temp).prototype, "getPropNames", [ src.v ], Object.getOwnPropertyDescriptor(component_class.prototype, "getPropNames"), component_class.prototype), 
        component_class), TSComponent = (component = new component_Component({
            tag: "login-component",
            dimensions: {
                width: "300px",
                height: "300px"
            },
            url: function(_ref) {
                return {
                    demo: "./ts.htm",
                    production: "https://my-site.com/login",
                    test: "mock://www.my-site.com/base/test/windows/login/index.htm"
                }[_ref.props.env];
            },
            props: {
                env: {
                    type: "string",
                    default: function() {
                        return "production";
                    }
                },
                tokenId: {
                    type: "string"
                },
                authToken: {
                    type: "string"
                },
                refSite: {
                    type: "string"
                },
                displayToolTip: {
                    type: "boolean"
                },
                onIconClick: {
                    type: "function"
                }
            },
            defaultContext: "iframe",
            prerenderTemplate: function(_ref2) {
                var doc = _ref2.doc;
                return node("html", null, node("head", null, node("style", null, "\n                        html, body {\n                            width:300px;\n                            height:300px;\n                            overflow: hidden;\n                            bottom: 0;\n                            position: fixed !important;\n                            left: 0 !important;\n                            margin: 0 !important;\n                            text-align: center;\n                        }\n                        .zoid-visible {\n                            bottom: 0 !important;\n                            position: fixed !important;\n                            left: 0 !important;\n                        }\n\n                        .spinner {\n                            height: 40px;\n                            width: 40px;\n                            bottom:10px;\n                            left:30px;\n                            position: fixed;\n                            transform: translateX(-50%) translateY(-50%);\n                            z-index: 10;\n                            \n                        }\n\n                        .spinner .loader {\n                            height: 100%;\n                            width: 100%;\n                            box-sizing: border-box;\n                            border: 3px solid rgba(0, 0, 0, .2);\n                            border-top-color: rgba(33, 128, 192, 0.8);\n                            border-radius: 100%;\n                            animation: rotation .7s infinite linear;\n\n                        }\n\n                        @keyframes rotation {\n                            from {\n                                transform: rotate(0deg)\n                            }\n                            to {\n                                transform: rotate(359deg)\n                            }\n                        }\n                    ")), node("body", null)).render(dom_dom({
                    doc: doc
                }));
            }
        }), (init = function(props) {
            return component.init(props);
        }).driver = function(name, dep) {
            return component.driver(name, dep);
        }, init.isChild = function() {
            return component.isChild();
        }, init.canRenderTo = function(win) {
            return component.canRenderTo(win);
        }, init.xprops = component.xprops, init);
        __webpack_require__.d(__webpack_exports__, "TSComponent", function() {
            return TSComponent;
        });
    } ]);
});
//# sourceMappingURL=ts-zoid-component.frame.js.map