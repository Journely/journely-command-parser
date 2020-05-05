export default class Commands {
    _commands: never[];
    _operations: never[];
    parse(input: string): never[];
    _normalizeInput(input: string): string;
    _splitCommands(input: string): string[];
    _getTarget(input: string, commandIndex: number): void;
    _getOperation(input: string, commandIndex: number): void;
    _setCommand(_command: object, _idx: number): void;
}
