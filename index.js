'use strict';

/* Loading Dependencies */
var clc = require('cli-color');

/* Creating Global Variables */
global.__variables = {};
global.__constants = {};
global.__functions = {};

/* Color Config */
var config = {
    log: {
        key: 'blue',
        msg: 'greenBright'
    },
    warn: {
        key: 'blue',
        msg: 'yellowBright'
    },
    error: {
        key: 'blue',
        msg: 'redBright'
    }
}

/* Defining Module */
var Native = {
    /* Object Types */
    isDefined: function(obj) {
        return typeof obj !== 'undefined' ? true : false;
    },
    isString: function(obj) {
        return typeof obj === 'string' ? true : false;
    },
    isObject: function(obj) {
        return typeof obj === 'object' && obj.indexOf === undefined && obj.splice === undefined ? true : false;
    },
    isArray: function(obj) {
        return typeof obj === 'object' && Array.isArray(obj) ? true : false;
    },
    isFunction: function(obj) {
        return typeof obj === 'function' ? true : false;
    },
    isNumber: function(obj) {
        return typeof obj === 'number' ? true : false;
    },
    isBoolean: function(obj) {
        return typeof obj === 'boolean' ? true : false;
    },

    /* String Types */
    isColor: function(obj) {
        return /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/.test(obj) ? true : false;
    },
    isURL: function(obj) {
        return /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(obj) ? true : false;
    },
    isEmail: function(obj) {
        return /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i.test(obj) ? true : false;
    },
    isDate: function(obj) {
        return !isNaN(new Date(obj).getDate()) ? true : false;
    },

    /**
     * Foreach loop for both object and array.
     * @param object {object:required} - Obejct that will pe parsed.
     * @param func {funtion:required} - Function that will be called in each loop. For array, we give "value" and "index" as arguments. For object, we give "key" and "value" as arguments.
     * @returns {object itself}
     */
    foreach: function(object, func, thisArg) {
        if (Native.isFunction(func)) {
            if (Native.isArray(object) && Native.isFunction(func)) {
                for (var i = 0; i < object.length; ++i) {
                    func.call(thisArg, object[i], i);
                }
            } else if (Native.isObject(object) && Native.isFunction(func)) {
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        func.call(thisArg, key, object[key]);
                    }
                }
            } else if (Native.isNumber(object) && Native.isFunction(func)) {
                for (var i = 1; i <= object; ++i) {
                    func.call(thisArg, i);
                }
            } else if (Native.isString(object) && Native.isFunction(func)) {
                for (var i = 0; i < object.length; ++i) {
                    func.call(thisArg, object.charAt(i), (i + 1));
                }
            } else {
                return console.error('Invalid arguments!');
            }
        }

        return object;
    },

    /**
     * Creating Private Variables.
     * @param name - String Variable Name.
     * @param value - Defined Value.
     * @returns {*}
     */
    vars: function(name, value) {
        if (Native.isString(name)) {
            if (Native.isDefined(value)) {
                global.__variables[name] = value;

                return value;
            } else {
                if (global.__variables.hasOwnProperty(name)) {
                    return global.__variables[name];
                } else {
                    //return console.warn('Variable "' + name + '" is undefined!');
                    return undefined;
                }
            }
        } else {
            return console.warn('Argument @name is required!');
        }
    },

    /**
     * Create Private Constants.
     * @param name - Constant Name.
     * @param value - Constant Value.
     * @returns {*}
     */
    cons: function(name, value) {
        if (Native.isString(name)) {
            if (Native.isDefined(value)) {
                if (!global.__constants.hasOwnProperty(name)) {
                    global.__constants[name] = value;

                    return value;
                } else {
                    return console.warn('Constant "' + name + '" already defined!');
                }
            } else {
                if (global.__constants.hasOwnProperty(name)) {
                    return global.__constants[name];
                } else {
                    return console.warn('Constant "' + name + '" is undefined!');
                }
            }
        } else {
            return console.warn('Argument @name is required!');
        }
    },

    func: function(name, handler) {
        if (Native.isString(name)) {
            if (Native.isFunction(handler)) {
                if (!global.__functions.hasOwnProperty(name)) {
                    global.__functions[name] = handler;

                    return handler;
                } else {
                    console.warn('Function "' + name + '" already defined!');
                }
            } else {
                if (global.__functions.hasOwnProperty(name)) {
                    return global.__functions[name];
                } else {
                    return console.warn('Function "' + name + '" is undefined!');
                }
            }
        } else {
            return console.warn('Argument @name is required!');
        }
    },

    /**
     * Split Url Parameters.
     * @param path
     * @returns {{path: string, name: string, extn: string}}
     */
    splitpath: function(path) {
        if (isString(path)) {
            var splited = path.split('/'),
                first = '',
                paths = '',
                files = '',
                exten = '';

            foreach(splited, function(value, index) {
                if (index === 0 && value === '/') {
                    first = '/';
                }
                if (index === (splited.length - 1)) {
                    files = value;
                } else {
                    paths = paths + value + '/';
                }
            });

            if (files !== '') {
                var ef = files.split('.'),
                    en = '',
                    ex = '';

                foreach(ef, function(value, index) {
                    if (index === (ef.length - 1)) {
                        ex = value;
                    } else {
                        en = en + value;
                        if (index !== ef.length - 2) {
                            en = en + '.';
                        }
                    }
                });

                files = en;
                exten = ex;
            }

            return {
                path: paths,
                name: files,
                extn: exten
            };
        }
    },
    log: function(key, msg) {
        if (Native.isString(key) && Native.isString(msg)) {
            console.log(clc.bold[config.log.key]('' + key + ' said: ') + clc[config.log.msg](msg));
        }
    },
    warn: function(key, msg) {
        if (Native.isString(key) && Native.isString(msg)) {
            console.warn(clc.bold[config.warn.key]('' + key + ' said: ') + clc[config.warn.msg](msg));
        }
    },
    error: function(key, msg) {
        if (Native.isString(key) && Native.isString(msg)) {
            console.error(clc.bold[config.error.key]('' + key + ' said: ') + clc[config.error.msg](msg));
        }
    },
}

/* Exporting Module */
module.exports = Native;
