interface CommandOptions {
  name: string;
}

const commandMap = new Map<string, Command>();

interface CommandRenderOptions {
  command: string;
}

export abstract class Command {
  options: CommandOptions;

  constructor(options: CommandOptions) {
    this.options = options;
  }

  abstract render(renderOptions: CommandRenderOptions): JSX.Element | string;
}

export async function loadCommands() {
  const commands = await Promise.all([
    import("./commands/HelpCommand"),
    import("./commands/AboutCommand"),
    import("./commands/WhoamiCommand"),
  ]);

  for (const file of commands) {
    const command = new file.default();
    commandMap.set(command.options.name, command);
  }

  return commandMap;
}