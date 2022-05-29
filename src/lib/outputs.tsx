export interface CommandOutputOptions {
  command: string;
}

export const COMMAND_LIST = ["help", "about", "whoami", "clear"];
export type CommandOutputFunc = (options: CommandOutputOptions) => JSX.Element | string;

export const initBanner: CommandOutputFunc = () => (
  <p className="my-3 -ml-9">
    <span className="block">
      {`
██████╗  █████╗  ███████╗ ██████╗  ███████╗ ██████╗
██╔════╝ ██╔══██╗ ██╔════╝ ██╔══██╗ ██╔════╝ ██╔══██╗
██║      ███████║ ███████╗ ██████╔╝ █████╗   ██████╔╝
██║      ██╔══██║ ╚════██║ ██╔═══╝  ██╔══╝   ██╔══██╗
╚██████╗ ██║  ██║ ███████║ ██║      ███████╗ ██║  ██║
 ╚═════╝ ╚═╝  ╚═╝ ╚══════╝ ╚═╝      ╚══════╝ ╚═╝  ╚═╝`}
    </span>
    <span className="block mt-3">
      {"Welcome to this epic site! Enter 'help' to see list of available commands"}
    </span>
  </p>
);

export const commandNotFound: CommandOutputFunc = ({ command }) => (
  <p>{`zsh: command not found: ${command}. Please try a different command.`}</p>
);
