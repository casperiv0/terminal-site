export function getCommandName(args: string[]) {
  const [_commandName, ...rest] = args;

  const isSudo = _commandName === "sudo";
  const commandName = isSudo ? rest[0] : _commandName;

  return { isSudo, commandName };
}
