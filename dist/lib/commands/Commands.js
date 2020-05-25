"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var targets_1 = __importDefault(require("../commands/targets"));
var TARGET_REGEX = /^(?<target>[A-aZ-z]+)[\s]?/im;
var VALUES_REGEX = /(\s(?<type>[a-zA-Z0-9]+))[:\s]?(["'](?<search>[a-zA-Z0-9_ ]+)["'])([:\s]?["'](?<value>[a-zA-Z0-9_ ]+)["'])?/gi;
var SEARCH_REPLACER_REGEX = /[\s'"_-]/im;
var Commands = /** @class */ (function () {
    function Commands() {
        this._commands = [];
        this._operations = [];
    }
    Commands.prototype.parse = function (input) {
        var _this = this;
        input = this._normalizeInput(input);
        var _splittedCommands = this._splitCommands(input);
        if (_splittedCommands.length > 0) {
            _splittedCommands.forEach(function (v, k) {
                _this._getTarget(v.trim(), k);
            });
        }
        // console.log(JSON.stringify(this._commands, null, 2));
        return this._commands;
    };
    Commands.prototype._normalizeInput = function (input) {
        if (!input || input === '')
            return input;
        return input.toLowerCase();
    };
    Commands.prototype._splitCommands = function (input) {
        if (!input || input === '')
            return [];
        return input.split(/[>&]/);
    };
    Commands.prototype._getTarget = function (input, commandIndex) {
        if (!input || input === '')
            return;
        var currentCommand = lodash_1.default.get(this._commands, [commandIndex], {});
        var match = input.match(TARGET_REGEX);
        var target = lodash_1.default.get(match, 'groups.target');
        //try to load up the corresponding config file
        var config;
        try {
            config = lodash_1.default.get(targets_1.default, target, '{}');
            currentCommand = lodash_1.default.set(currentCommand, 'target', target);
            this._setCommand(config, currentCommand, commandIndex);
            this._getOperation(config, input, commandIndex);
        }
        catch (error) {
            console.log(error);
        }
    };
    Commands.prototype._getOperation = function (config, input, commandIndex) {
        if (!input || input === '')
            return;
        var currentCommand = lodash_1.default.get(this._commands, [commandIndex], {});
        var _res;
        var _loop_1 = function () {
            var _groups = lodash_1.default.get(_res, 'groups', null);
            if (_groups) {
                var _type = lodash_1.default.get(_groups, 'type', '');
                var _search_1 = lodash_1.default.get(_groups, 'search', '').replace(SEARCH_REPLACER_REGEX, '');
                var _value = lodash_1.default.get(_groups, 'value', '');
                //if value is absent then the type is an object...so load match the objects for the given target
                //but make sure the target it present as well
                if ((!_value || _value === '') && lodash_1.default.has(currentCommand, 'data.target')) {
                    //load up the objects from the current target
                    var _currentTargetObjects = Object.keys(lodash_1.default.get(currentCommand, 'config.objects', {})).join('|');
                    currentCommand = lodash_1.default.set(currentCommand, 'data.object', {
                        name: lodash_1.default.get(_type.match(new RegExp("(" + _currentTargetObjects + ")", 'im')), 0, ''),
                        search: _search_1,
                    });
                    this_1._setCommand(config, currentCommand, commandIndex);
                }
                //if value is filled then this is a field...but we need to make sure there is an object selected
                if (_value && _value !== '' && lodash_1.default.has(currentCommand, 'data.object.name')) {
                    var _currentTargetFields_1;
                    var _currentField = void 0;
                    Object.keys(lodash_1.default.get(config, 'objects', {})).forEach(function (v) {
                        if (v.toLowerCase() === lodash_1.default.get(currentCommand, 'data.object.name')) {
                            _currentTargetFields_1 = lodash_1.default.get(config, ['objects', v, 'fields'], []);
                        }
                    });
                    _currentTargetFields_1 = lodash_1.default.keyBy(_currentTargetFields_1, 'name');
                    _currentField = lodash_1.default.find(_currentTargetFields_1, function (v, k) {
                        return k.toLowerCase() === _search_1;
                    });
                    currentCommand = lodash_1.default.set(currentCommand, 'data.field', __spreadArrays(lodash_1.default.get(currentCommand, 'data.field', []), [
                        { name: lodash_1.default.get(_currentField, 'name'), value: _value },
                    ]));
                    this_1._setCommand(config, currentCommand, commandIndex);
                }
            }
        };
        var this_1 = this;
        while ((_res = VALUES_REGEX.exec(input))) {
            _loop_1();
        }
    };
    Commands.prototype._setCommand = function (config, _command, _idx) {
        if (_command && lodash_1.default.get(_command, 'target')) {
            this._commands = lodash_1.default.set(this._commands, _idx, { data: __assign({}, _command), config: __assign({}, config) });
        }
    };
    return Commands;
}());
exports.default = Commands;
