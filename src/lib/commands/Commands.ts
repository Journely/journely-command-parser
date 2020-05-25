import _ from 'lodash';
import fs from 'fs';
import targets from '../commands/targets';

const TARGET_REGEX = /^(?<target>[A-aZ-z]+)[\s]?/im;
const VALUES_REGEX = /(\s(?<keyword>[a-zA-Z0-9]+))[:\s]?((?<index>[a-zA-Z0-9_ ]+))([:\s]?["'](?<search>[a-zA-Z0-9_ ]+)["'])([:\s]?["'](?<value>[a-zA-Z0-9_ ]+)["'])?/gi;

export default class Commands {
  _commands = [];
  _operations = [];

  parse(input: string) {
    const _splittedCommands = this._splitCommands(input);
    if (_splittedCommands.length > 0) {
      _splittedCommands.forEach((v, k) => {
        this._getTarget(v.trim(), k);
      });
    }
    console.log(JSON.stringify(this._commands, null, 2));
    return this._commands;
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
      config = _.get(targets, target, '{}');
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
        let _keyword = _.get(_groups, 'keyword', '').toLowerCase();
        let _index = _.get(_groups, 'index', '').toLowerCase();
        let _search = _.get(_groups, 'search', '');
        let _value = _.get(_groups, 'value', '');

        //1. match the keyword
        //deal with the object keyword
        if (_keyword === 'object' && _index !== '') {
          let _currentTargetObject: string = '';
          Object.keys(_.get(config, 'objects', {})).forEach((v) => {
            if (v.toLowerCase() === _index) {
              _currentTargetObject = v;
            }
          });

          let input = {
            name: _currentTargetObject,
            search: _search,
          };
          if (_value && _value !== '') {
            _.set(input, 'value', _value);
          }

          currentCommand = _.set(currentCommand, 'data.object', input);
          this._setCommand(config, currentCommand, commandIndex);
        }

        //deal with the key Keyword
        if (_keyword === 'field' && _index !== '' && _.get(currentCommand, 'data.object')) {
          let _currentTargetField: any;
          const fields = _.get(config, ['objects', _.get(currentCommand, 'data.object.name'), 'fields'], {});
          fields.forEach((v: any) => {
            if (_.get(v, 'name', '').toLowerCase() === _index) {
              _currentTargetField = _.get(v, 'name', '');
            }
          });

          let input = { name: _currentTargetField, search: _search };
          if (_value && _value !== '') {
            _.set(input, 'value', _value);
          }

          currentCommand = _.set(currentCommand, 'data.field', [..._.get(currentCommand, 'data.field', []), input]);
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
