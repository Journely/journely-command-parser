import Commands from './lib/commands/Commands';

export const process = (input: string) => {
  const c = new Commands();
  let command = c.parse(input);
  console.log(JSON.stringify(command, null, 2));
};

process('salesforce opportunity:"Something" field:"Next Steps":"Test" field:"amount":"1000"');
