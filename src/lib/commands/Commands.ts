import _ from 'lodash';
import toolsDef from './tools.def.json';

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
        this._getTarget(v, k);
        this._getOperation(v, k);
      });
    }

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
    const regex = new RegExp(`(${Object.keys(toolsDef).join('|')})`, 'im');
    currentCommand = _.set(currentCommand, 'target', _.get(input.match(regex), 0, null));
    this._setCommand(currentCommand, commandIndex);
  }

  _getOperation(input: string, commandIndex: number) {
    if (!input || input === '') return;
    let currentCommand = _.get(this._commands, [commandIndex], {});
    let _res;
    while ((_res = VALUES_REGEX.exec(input))) {
      let _groups = _.get(_res, 'groups', null);
      if (_groups) {
        let _type = _.get(_groups, 'type', null);
        let _search = _.get(_groups, 'search', null).replace(SEARCH_REPLACER_REGEX, '_');
        let _value = _.get(_groups, 'value', null);

        //if value is absent then the type is an object...so load match the objects for the given target
        //but make sure the target it present as well
        if ((!_value || _value === '') && _.has(currentCommand, 'target')) {
          //load up the objects from the current target
          let _currentTargetObjects = Object.keys(_.get(toolsDef, [_.get(currentCommand, 'target', null), 'objects'], '')).join('|');
          currentCommand = _.set(currentCommand, 'object', {
            name: _.get(_type.match(new RegExp(`(${_currentTargetObjects})`, 'im')), 0, null),
            search: _search,
          });
          this._setCommand(currentCommand, commandIndex);
        }
        //if value is filled then this is a field...but we need to make sure there is an object selected
        if (_value && _value !== '' && _.has(currentCommand, 'object.name')) {
          let _currentTargetFields = _.get(
            toolsDef,
            [_.get(currentCommand, 'target', null), 'objects', _.get(currentCommand, 'object.name', null), 'fields'],
            []
          )
            .map((v: object) => _.get(v, 'name', '').replace(SEARCH_REPLACER_REGEX, '_'))
            .join('|');
          currentCommand = _.set(currentCommand, 'field', [
            ..._.get(currentCommand, 'field', []),
            { name: _.get(_search.match(new RegExp(`(${_currentTargetFields})`, 'im')), 0, null), value: _value },
          ]);
          this._setCommand(currentCommand, commandIndex);
        }
      }
    }
  }

  _setCommand(_command: object, _idx: number) {
    if (_command && _.get(_command, 'target')) {
      this._commands = _.set(this._commands, _idx, { ..._command, ..._.get(toolsDef, [_.get(_command, 'target')]) });
    }
  }
}
