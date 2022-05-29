import { COMMAND_LIST } from "../outputs";
import { Command } from "../Command";

export default class HelpCommand extends Command {
  constructor() {
    super({ name: "help" });
  }

  render(): string | JSX.Element {
    return (
      <div>
        <p className="font-semibold">Hello world, welcome!</p>

        <div className="mt-3">
          <p className="underline">Available commands</p>

          <ul className="flex flex-col">
            {COMMAND_LIST.map((command) => (
              <li key={command}>{command}</li>
            ))}
          </ul>
        </div>

        <p className="flex flex-col mt-5">
          <span>
            <kbd>[tab]</kbd>: complete command
          </span>
          <span>
            <kbd>[ctrl+l]</kbd>: clear terminal
          </span>
          <span>
            <kbd>[arrowUp]</kbd>: previous command
          </span>
        </p>
      </div>
    );
  }
}
