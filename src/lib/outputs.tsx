export interface CommandOutputOptions {
  command: string;
}

export const COMMAND_LIST = ["help", "about", "whoami", "clear"];
export type CommandOutputFunc = (options: CommandOutputOptions) => JSX.Element | string;

export const commandNotFound: CommandOutputFunc = ({ command }) => (
  <p>{`zsh: command not found: ${command}. Please try a different command.`}</p>
);
