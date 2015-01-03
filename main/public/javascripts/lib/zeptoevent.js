var U = {};
(function () {
    U.event = function (selector) {
        return new init(selector);
    };
    function init(selector) {
        var each = $.each;
        if (isString(selector)) {
            selector = slice.call(document.querySelectorAll(selector));
        }
        typeof selector === 'object' && selector.length && (selector = slice.call(selector));
        if (!selector.length) {
            this[0] = selector;
            this.length = 1;
        }
        else {
            var self = this;
            $.each(selector, function (index, ele) {
                self[index] = ele;
            });
            this.length = selector.length;
        }
    }

    var $ = init;
    $.fn = $.prototype;
    var _zid = 1, undefined,
        slice = Array.prototype.slice,
    //isFunction = $.isFunction,
        isFunction = function (value) {
            return typeof value === 'function';
        },
        isString = function (obj) {
            return typeof obj == 'string'
        },
        isDocument = function (obj) {
            return obj != null && obj.nodeType == obj.DOCUMENT_NODE
        },
        isArray = Array.isArray ||
            function (object) {
                return object instanceof Array
            },
        handlers = {},
        specialEvents = {},
        focusinSupported = 'onfocusin' in window,
        focus = {focus: 'focusin', blur: 'focusout'},
        hover = {mouseenter: 'mouseover', mouseleave: 'mouseout'};
    var class2type = {};
    $.each = function (elements, callback) {
        var i, key;
        if ((typeof elements.length == 'number')) {
            for (i = 0; i < elements.length; i++)
                if (callback.call(elements[i], i, elements[i]) === false) return elements
        } else {
            for (key in elements)
                if (callback.call(elements[key], key, elements[key]) === false) return elements
        }

        return elements
    };
    $.fn.each = function (cb) {
        $.each(this, function (index, item) {
            cb.apply(this,[index, item]);
        });
        return this;
    };
    $.fn.closest = function (selector, context) {
        var node = this[0], collection = false;
        if (typeof selector == 'object') collection = U.event(selector);
        while (node && !(collection ? collection.indexOf(node) >= 0 : matches(node, selector)))
            node = node !== context && !isDocument(node) && node.parentNode;
        return U.event(node);
    };
    $.fn.get = function (index) {
        return this[index];
    };
    $.fn.indexOf=function(item){
        for(var i= 0,len=this.length;i<len;++i)
        {
            if(this[i]==item){
               return i;
            }
        }
        return -1;
    };
    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';

    function type(obj) {
        return obj == null ? String(obj) :
        class2type[toString.call(obj)] || "object"
    }

    function isWindow(obj) {
        return obj != null && obj == obj.window
    }

    function isObject(obj) {
        return type(obj) == "object"
    }

    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    }

    function matches(element, selector) {
        if (!selector || !element || element.nodeType !== 1) return false
        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
            element.oMatchesSelector || element.matchesSelector;
        if (matchesSelector) return matchesSelector.call(element, selector);
    }

    function zid(element) {
        return element._zid || (element._zid = _zid++)
    }

    function findHandlers(element, event, fn, selector) {
        event = parse(event);
        if (event.ns) var matcher = matcherFor(event.ns)
        return (handlers[zid(element)] || []).filter(function (handler) {
            return handler
                && (!event.e || handler.e == event.e)
                && (!event.ns || matcher.test(handler.ns))
                && (!fn || zid(handler.fn) === zid(fn))
                && (!selector || handler.sel == selector)
        })
    }

    function parse(event) {
        var parts = ('' + event).split('.');
        return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
    }

    function matcherFor(ns) {
        return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
    }

    function eventCapture(handler, captureSetting) {
        return handler.del &&
            (!focusinSupported && (handler.e in focus)) || !!captureSetting
    }

    function realEvent(type) {
        return hover[type] || (focusinSupported && focus[type]) || type
    }

    /**
     *
     * @param  child 子元素
     * @param target 要匹配的元素
     */
    function isParent(child,target){
        var status=false;
        while(!isDocument(child)){
            child=child.parentNode;
            if(child==target){
                status=true;
                break;
            }
        }
        return status;
    }
    function stopPropagation(handleArr,target,currentTarget,element){
        var reg=/(.+\.stopPropagation)|(return false)/g;
        if((target!=currentTarget)&&isParent(target,currentTarget)){
            $.each(handleArr,function(index,item){
                var dom=item.dom;
                var m;
                (dom.indexOf(target)>=0)&&(m=true);
                if(m && reg.test(item.fn.toString())){
                    element.__propagation=target;
                    return false;
                }
            });
        }
    }
    function add(element, events, fn, data, selector, delegator, capture) {
        var id = zid(element), set = (handlers[id] || (handlers[id] = []));
        events.split(/\s/).forEach(function (event) {
            if (event == 'ready') return $(document).ready(fn);
            var handler = parse(event);
            handler.fn = fn;
            handler.sel = selector;
            handler.dom=slice.call(element.querySelectorAll(selector));
            // emulate mouseenter, mouseleave
            if (handler.e in hover) fn = function (e) {
                var related = e.relatedTarget
                if (!related || (related !== this && !$.contains(this, related)))
                    return handler.fn.apply(this, arguments);
            };
            handler.del = delegator;
            var callback = delegator || fn;
            handler.proxy = function (e) {
                var handleArr=handlers[element._zid];
                var matchEle = U.event(e.target).closest(selector, element).get(0);
                if(matchEle===false){
                    return;
                }
                delete e.currentTarget;
                e.currentTarget=matchEle;
                stopPropagation(handleArr, e.target,matchEle,element);
                if(element.__propagation && isParent(element.__propagation,matchEle)){
                    delete element.__propagation || (element.__propagation=null);
                    return;
                }
                e.delegateTarget=element;

                e = compatible(e);
                if (e.isImmediatePropagationStopped()) return
                e.data = data
                var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
                if (result === false){
                    e.preventDefault();e.stopPropagation();
                    e.delegateTarget.__propagation=e.currentTarget;
                }
                return result
            }
            handler.i = set.length
            set.push(handler)
            if ('addEventListener' in element)
                element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
        })
    }

    function remove(element, events, fn, selector, capture) {
        var id = zid(element)
            ;
        (events || '').split(/\s/).forEach(function (event) {
            findHandlers(element, event, fn, selector).forEach(function (handler) {
                delete handlers[id][handler.i]
                if ('removeEventListener' in element)
                    element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
            })
        })
    }

    //$.event = { add: add, remove: remove };
    U.event.add = add;
    U.event.remove = remove;
    U.event.proxy = $.proxy = function (fn, context) {
        var args = (2 in arguments) && slice.call(arguments, 2)
        if (isFunction(fn)) {
            var proxyFn = function () {
                return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments)
            }
            proxyFn._zid = zid(fn);
            return proxyFn
        } else if (isString(context)) {
            if (args) {
                args.unshift(fn[context], fn)
                return $.proxy.apply(null, args)
            } else {
                return $.proxy(fn[context], fn)
            }
        } else {
            throw new TypeError("expected function")
        }
    };

    $.fn.bind = function (event, data, callback) {
        return this.on(event, data, callback)
    };

    $.fn.unbind = function (event, callback) {
        return this.off(event, callback)
    };


    $.fn.one = function (event, selector, data, callback) {
        return this.on(event, selector, data, callback, 1)
    };

    var returnTrue = function () {
            return true
        },
        returnFalse = function () {
            return false
        },
        ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
        eventMethods = {
            preventDefault: 'isDefaultPrevented',
            stopImmediatePropagation: 'isImmediatePropagationStopped',
            stopPropagation: 'isPropagationStopped'
        };

    function compatible(event, source) {
        if (source || !event.isDefaultPrevented) {
            source || (source = event)

            $.each(eventMethods, function (name, predicate) {
                var sourceMethod = source[name];
                event[name] = function () {
                    this[predicate] = returnTrue;
                    if(name==='stopPropagation'){
                        event.delegateTarget.__propagation=event.currentTarget;
                    }
                    return sourceMethod && sourceMethod.apply(source, arguments)
                };
                event[predicate] = returnFalse
            });

            if (source.defaultPrevented !== undefined ? source.defaultPrevented :
                    'returnValue' in source ? source.returnValue === false :
                    source.getPreventDefault && source.getPreventDefault())
                event.isDefaultPrevented = returnTrue
        }
        return event
    }

    function createProxy(event) {
        var key, proxy = {originalEvent: event}
        for (key in event)
            if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key];

        return compatible(proxy, event)
    }

    function extend(target, source, deep) {
        for (var key in source)
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                    target[key] = {};
                if (isArray(source[key]) && !isArray(target[key]))
                    target[key] = []
                extend(target[key], source[key], deep)
            }
            else if (source[key] !== undefined) target[key] = source[key]
    }
    $.extend = function(target){
        var deep, args = slice.call(arguments, 1);
        if (typeof target == 'boolean') {
            deep = target
            target = args.shift()
        }
        args.forEach(function(arg){ extend(target, arg, deep) });
        return target
    };
    $.fn.delegate = function (selector, event, callback) {
        return this.on(event, selector, callback)
    };
    $.fn.undelegate = function (selector, event, callback) {
        return this.off(event, selector, callback)
    };

    $.fn.live = function (event, callback) {
        $(document.body).delegate(this.selector, event, callback)
        return this
    };
    $.fn.die = function (event, callback) {
        $(document.body).undelegate(this.selector, event, callback)
        return this
    };

    $.fn.on = function (event, selector, data, callback, one) {
        var autoRemove, delegator, $this = this;

        if (event && !isString(event)) {
            $.each(event, function (type, fn) {
                $this.on(type, selector, data, fn, one)
            });
            return $this
        }

        if (!isString(selector) && !isFunction(callback) && callback !== false)
            callback = data, data = selector, selector = undefined
        if (isFunction(data) || data === false)
            callback = data, data = undefined

        if (callback === false) callback = returnFalse

        return $this.each(function (_, element) {
            if (one) autoRemove = function (e) {
                remove(element, e.type, callback)
                return callback.apply(this, arguments)
            };

            if (selector) delegator = function (e) {
                var evt, match = U.event(e.target).closest(selector, element).get(0);
                if (match && match !== element) {
                    evt = $.extend(createProxy(e), {
                        //currentTarget: match,
                        liveFired: element});
                    return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
                }
            };

            add(element, event, callback, data, selector, delegator || autoRemove)
        })
    };
    $.fn.off = function (event, selector, callback) {
        var $this = this
        if (event && !isString(event)) {
            $.each(event, function (type, fn) {
                $this.off(type, selector, fn)
            })
            return $this
        }

        if (!isString(selector) && !isFunction(callback) && callback !== false)
            callback = selector, selector = undefined

        if (callback === false) callback = returnFalse

        return $this.each(function () {
            remove(this, event, callback, selector)
        })
    };

    $.fn.trigger = function (event, args) {
        event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
        event._args = args
        return this.each(function () {
            // handle focus(), blur() by calling them directly
            if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
            // items in the collection might not be DOM elements
            else if ('dispatchEvent' in this) this.dispatchEvent(event)
            else $(this).triggerHandler(event, args)
        })
    }

    // triggers event handlers on current element just as if an event occurred,
    // doesn't trigger an actual event, doesn't bubble
    $.fn.triggerHandler = function (event, args) {
        var e, result
        this.each(function (i, element) {
            e = createProxy(isString(event) ? $.Event(event) : event)
            e._args = args
            e.target = element
            $.each(findHandlers(element, event.type || event), function (i, handler) {
                result = handler.proxy(e)
                if (e.isImmediatePropagationStopped()) return false
            })
        })
        return result
    }

        // shortcut methods for `.bind(event, fn)` for each event type
    ;
    ('focusin focusout focus blur load resize scroll unload click dblclick ' +
    'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
    'change select keydown keypress keyup error').split(' ').forEach(function (event) {
            $.fn[event] = function (callback) {
                return (0 in arguments) ?
                    this.bind(event, callback) :
                    this.trigger(event)
            }
        });


    U.event.Event = $.Event = function (type, props) {
        if (!isString(type)) props = type, type = props.type
        var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
        if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        event.initEvent(type, bubbles, true)
        return compatible(event)
    }

})();
