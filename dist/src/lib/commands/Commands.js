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
var tools_def_json_1 = __importDefault(require("./tools.def.json"));
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
                _this._getTarget(v, k);
                _this._getOperation(v, k);
            });
        }
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
        var regex = new RegExp("(" + Object.keys(tools_def_json_1.default).join('|') + ")", 'im');
        currentCommand = lodash_1.default.set(currentCommand, 'target', lodash_1.default.get(input.match(regex), 0, null));
        this._setCommand(currentCommand, commandIndex);
    };
    Commands.prototype._getOperation = function (input, commandIndex) {
        if (!input || input === '')
            return;
        var currentCommand = lodash_1.default.get(this._commands, [commandIndex], {});
        var _res;
        while ((_res = VALUES_REGEX.exec(input))) {
            var _groups = lodash_1.default.get(_res, 'groups', null);
            if (_groups) {
                var _type = lodash_1.default.get(_groups, 'type', null);
                var _search = lodash_1.default.get(_groups, 'search', null).replace(SEARCH_REPLACER_REGEX, '_');
                var _value = lodash_1.default.get(_groups, 'value', null);
                //if value is absent then the type is an object...so load match the objects for the given target
                //but make sure the target it present as well
                if ((!_value || _value === '') && lodash_1.default.has(currentCommand, 'target')) {
                    //load up the objects from the current target
                    var _currentTargetObjects = Object.keys(lodash_1.default.get(tools_def_json_1.default, [lodash_1.default.get(currentCommand, 'target', null), 'objects'], '')).join('|');
                    currentCommand = lodash_1.default.set(currentCommand, 'object', {
                        name: lodash_1.default.get(_type.match(new RegExp("(" + _currentTargetObjects + ")", 'im')), 0, null),
                        search: _search,
                    });
                    this._setCommand(currentCommand, commandIndex);
                }
                //if value is filled then this is a field...but we need to make sure there is an object selected
                if (_value && _value !== '' && lodash_1.default.has(currentCommand, 'object.name')) {
                    var _currentTargetFields = lodash_1.default.get(tools_def_json_1.default, [lodash_1.default.get(currentCommand, 'target', null), 'objects', lodash_1.default.get(currentCommand, 'object.name', null), 'fields'], [])
                        .map(function (v) { return lodash_1.default.get(v, 'name', '').replace(SEARCH_REPLACER_REGEX, '_'); })
                        .join('|');
                    currentCommand = lodash_1.default.set(currentCommand, 'field', __spreadArrays(lodash_1.default.get(currentCommand, 'field', []), [
                        { name: lodash_1.default.get(_search.match(new RegExp("(" + _currentTargetFields + ")", 'im')), 0, null), value: _value },
                    ]));
                    this._setCommand(currentCommand, commandIndex);
                }
            }
        }
    };
    Commands.prototype._setCommand = function (_command, _idx) {
        if (_command && lodash_1.default.get(_command, 'target')) {
            this._commands = lodash_1.default.set(this._commands, _idx, __assign(__assign({}, _command), lodash_1.default.get(tools_def_json_1.default, [lodash_1.default.get(_command, 'target')])));
        }
    };
    return Commands;
}());
exports.default = Commands;
