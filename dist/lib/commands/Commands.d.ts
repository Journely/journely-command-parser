export default class Commands {
    _commands: never[];
    _operations: never[];
    parse(input: string): never[];
    _reset(): void;
    _splitCommands(input: string): string[];
    _saveMetadata(config: any, input: string, commandIndex: number): void;
    _getTarget(input: string, commandIndex: number): void;
    _getOperation(config: any, input: string, commandIndex: number): void;
    _setCommand(config: any, _command: object, _idx: number): void;
}
