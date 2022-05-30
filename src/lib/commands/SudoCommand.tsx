import { Command } from "../Command";

export default class SudoCommand extends Command {
  constructor() {
    super({ name: "sudo" });
  }

  render(): string | JSX.Element {
    return (
      <div className="select-none -mt-1">
        {`usage: sudo -h | -K | -k | -V
usage: sudo -v [-AknS] [-g group] [-h host] [-p prompt] [-u user]
usage: sudo -l [-AknS] [-g group] [-h host] [-p prompt] [-U user] [-u user] [command]
usage: sudo [-AbEHknPS] [-r role] [-t type] [-C num] [-g group] [-h host] [-p prompt] [-T timeout] [-u user] [VAR=value] [-i|-s] [<command>]
usage: sudo -e [-AknS] [-r role] [-t type] [-C num] [-g group] [-h host] [-p prompt] [-T timeout] [-u user] file ...`}

        <p className="mt-3 font-semibold">
          {"PS: these options don't actually work, but try `sudo [command]`!"}
        </p>
      </div>
    );
  }
}
