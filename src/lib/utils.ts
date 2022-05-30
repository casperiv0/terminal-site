export function getCommandName(args: string[]) {
  const [_commandName, ...rest] = args;

  const isSudo = _commandName === "sudo" && rest.length >= 1;
  const commandName = isSudo ? rest[0] : _commandName;
  const commandArgs = isSudo ? rest.slice(1, rest.length) : rest;

  return { isSudo, commandArgs, commandName };
}
