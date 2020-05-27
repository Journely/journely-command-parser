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
var VALUES_REGEX = /(\s(?<keyword>[a-zA-Z0-9]+))[:\s]?((?<index>[a-zA-Z0-9_ ]+))([:\s]?["'](?<search>[a-zA-Z0-9_ ]+)["'])([:\s]?["'](?<value>[a-zA-Z0-9_ ]+)["'])?/gi;
var Commands = /** @class */ (function () {
    function Commands() {
        this._commands = [];
        this._operations = [];
    }
    Commands.prototype.parse = function (input) {
        var _this = this;
        //reset
        this._reset();
        var _splittedCommands = this._splitCommands(input);
        if (_splittedCommands.length > 0) {
            _splittedCommands.forEach(function (v, k) {
                _this._getTarget(v.trim(), k);
            });
        }
        // console.log(JSON.stringify(this._commands, null, 2));
        return this._commands;
    };
    Commands.prototype._reset = function () {
        this._commands = [];
        this._operations = [];
    };
    Commands.prototype._splitCommands = function (input) {
        if (!input || input === '')
            return [];
        return input.split(/[>&]/);
    };
    Commands.prototype._saveMetadata = function (config, input, commandIndex) {
        if (!input || input === '')
            return;
        var currentCommand = lodash_1.default.get(this._commands, [commandIndex], {});
        lodash_1.default.set(currentCommand, 'data.metadata.rawCommand', input);
        this._setCommand(config, currentCommand, commandIndex);
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
                var _keyword = lodash_1.default.get(_groups, 'keyword', '').toLowerCase();
                var _index_1 = lodash_1.default.get(_groups, 'index', '').toLowerCase();
                var _search = lodash_1.default.get(_groups, 'search', '');
                var _value = lodash_1.default.get(_groups, 'value', '');
                //1. match the keyword
                //deal with the object keyword
                if (_keyword === 'object' && _index_1 !== '') {
                    var _currentTargetObject_1 = '';
                    Object.keys(lodash_1.default.get(config, 'objects', {})).forEach(function (v) {
                        if (v.toLowerCase() === _index_1) {
                            _currentTargetObject_1 = v;
                        }
                    });
                    var input_1 = {
                        name: _currentTargetObject_1,
                        search: _search,
                    };
                    if (_value && _value !== '') {
                        lodash_1.default.set(input_1, 'value', _value);
                    }
                    currentCommand = lodash_1.default.set(currentCommand, 'data.object', input_1);
                    this_1._setCommand(config, currentCommand, commandIndex);
                }
                //deal with the key Keyword
                if (_keyword === 'field' && _index_1 !== '' && lodash_1.default.get(currentCommand, 'data.object')) {
                    var _currentTargetField_1;
                    var fields = lodash_1.default.get(config, ['objects', lodash_1.default.get(currentCommand, 'data.object.name'), 'fields'], {});
                    fields.forEach(function (v) {
                        if (lodash_1.default.get(v, 'name', '').toLowerCase() === _index_1) {
                            _currentTargetField_1 = lodash_1.default.get(v, 'name', '');
                        }
                    });
                    var input_2 = { name: _currentTargetField_1, search: _search };
                    if (_value && _value !== '') {
                        lodash_1.default.set(input_2, 'value', _value);
                    }
                    currentCommand = lodash_1.default.set(currentCommand, 'data.field', __spreadArrays(lodash_1.default.get(currentCommand, 'data.field', []), [input_2]));
                    this_1._setCommand(config, currentCommand, commandIndex);
                }
            }
        };
        var this_1 = this;
        while ((_res = VALUES_REGEX.exec(input))) {
            _loop_1();
        }
        //finally save the metadata
        this._saveMetadata(config, input, commandIndex);
    };
    Commands.prototype._setCommand = function (config, _command, _idx) {
        if (_command && lodash_1.default.get(_command, 'target')) {
            this._commands = lodash_1.default.set(this._commands, _idx, { data: __assign({}, _command), config: __assign({}, config) });
        }
    };
    return Commands;
}());
exports.default = Commands;
