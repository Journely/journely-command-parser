import _ from 'lodash';
import fs from 'fs';

const TARGET_REGEX = /^(?<target>[A-aZ-z]+)[\s]?/im;
const VALUES_REGEX = /(\s(?<type>[a-zA-Z0-9]+))[:\s]?(["'](?<search>[a-zA-Z0-9_ ]+)["'])([:\s]?["'](?<value>[a-zA-Z0-9_ ]+)["'])?/gi;
const SEARCH_REPLACER_REGEX = /[\s'"_-]/im;

export default class Commands {
  _commands = [];
  _operations = [];

  parse(input: string) {
    input = this._normalizeInput(input);
    const _splittedCommands = this._splitCommands(input);
    if (_splittedCommands.length > 0) {
      _splittedCommands.forEach((v, k) => {
        this._getTarget(v.trim(), k);
      });
    }
    console.log(this._commands);
    return this._commands;
  }

  _normalizeInput(input: string) {
    if (!input || input === '') return input;
    return input.toLowerCase();
  }

  _splitCommands(input: string) {
    if (!input || input === '') return [];
    return input.split(/[>&]/);
  }

  _getTarget(input: string, commandIndex: number) {
    if (!input || input === '') return;
    let currentCommand = _.get(this._commands, [commandIndex], {});
    const match = input.match(TARGET_REGEX);
    const target = _.get(match, 'groups.target');
    //try to load up the corresponding config file
    let config;
    try {
      config = JSON.parse(fs.readFileSync(__dirname + `/targets/${target}.json`, 'utf8'));
      currentCommand = _.set(currentCommand, 'target', target);
      this._setCommand(config, currentCommand, commandIndex);
      this._getOperation(config, input, commandIndex);
    } catch (error) {
      console.log(error);
    }
  }

  _getOperation(config: any, input: string, commandIndex: number) {
    if (!input || input === '') return;
    let currentCommand = _.get(this._commands, [commandIndex], {});
    let _res;
    while ((_res = VALUES_REGEX.exec(input))) {
      let _groups = _.get(_res, 'groups', null);
      if (_groups) {
        let _type = _.get(_groups, 'type', '');
        let _search = _.get(_groups, 'search', '').replace(SEARCH_REPLACER_REGEX, '');
        let _value = _.get(_groups, 'value', '');

        //if value is absent then the type is an object...so load match the objects for the given target
        //but make sure the target it present as well
        if ((!_value || _value === '') && _.has(currentCommand, 'data.target')) {
          //load up the objects from the current target
          let _currentTargetObjects = Object.keys(_.get(currentCommand, 'config.objects', {})).join('|');

          currentCommand = _.set(currentCommand, 'data.object', {
            name: _.get(_type.match(new RegExp(`(${_currentTargetObjects})`, 'im')), 0, ''),
            search: _search,
          });

          this._setCommand(config, currentCommand, commandIndex);
        }

        //if value is filled then this is a field...but we need to make sure there is an object selected
        if (_value && _value !== '' && _.has(currentCommand, 'data.object.name')) {
          let _currentTargetFields: any;
          let _currentField: any;

          Object.keys(_.get(config, 'objects', {})).forEach((v) => {
            if (v.toLowerCase() === _.get(currentCommand, 'data.object.name')) {
              _currentTargetFields = _.get(config, ['objects', v, 'fields'], []);
            }
          });

          _currentTargetFields = _.keyBy(_currentTargetFields, 'name');
          _currentField = _.find(_currentTargetFields, (v, k) => {
            return k.toLowerCase() === _search;
          });

          currentCommand = _.set(currentCommand, 'data.field', [
            ..._.get(currentCommand, 'data.field', []),
            { name: _.get(_currentField, 'name'), value: _value },
          ]);

          this._setCommand(config, currentCommand, commandIndex);
        }
      }
    }
  }

  _setCommand(config: any, _command: object, _idx: number) {
    if (_command && _.get(_command, 'target')) {
      this._commands = _.set(this._commands, _idx, { data: { ..._command }, config: { ...config } });
    }
  }
}
