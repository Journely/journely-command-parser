import Commands from './lib/commands/Commands';

export const parse = (input: string) => {
  const c = new Commands();
  return c.parse(input);
};
