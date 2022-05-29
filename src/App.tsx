import * as React from "react";
import { Input } from "./components/Input";
import { Command, loadCommands } from "./lib/Command";
import { commandNotFound } from "./lib/outputs";

export enum CommandStatus {
  Succeeded,
  Failed,
}

export interface CommandEntry {
  output: JSX.Element | string | null;
  command: string | null;
  status?: CommandStatus;
}

function App() {
  const [commandMap, setCommandMap] = React.useState(new Map<string, Command>());
  const [entries, setEntries] = React.useState<CommandEntry[]>([{ output: null, command: null }]);

  const _loadCommands = React.useCallback(async () => {
    setCommandMap(await loadCommands());
  }, []);

  React.useEffect(() => {
    _loadCommands();
  }, [_loadCommands]);

  function handleNewCommand(commandName: string, idx: number) {
    const commandFunctionOptions = { command: commandName };

    if (commandName === "clear") {
      return setEntries([{ command: null, output: null, status: CommandStatus.Succeeded }]);
    }

    const command = commandMap.get(commandName);
    if (!command) {
      _addCommandToEntries(idx, {
        status: CommandStatus.Failed,
        command: commandName,
        output: commandNotFound(commandFunctionOptions),
      });

      return;
    }

    const output = command.render({ command: commandName });
    _addCommandToEntries(idx, {
      status: CommandStatus.Succeeded,
      command: commandName,
      output,
    });
  }

  function _addCommandToEntries(idx: number, entry: CommandEntry) {
    const newEntries = [...entries];
    newEntries[idx] = entry;
    setEntries([...newEntries, { command: null, output: null }]);
  }

  return (
    <div className="m-12">
      {entries.map((entry, idx) => {
        const commandEntry = entry.command ? entry : null;

        return (
          <div key={idx} data-status={commandEntry?.status} data-entry={idx}>
            <Input
              entry={commandEntry}
              handleNewCommand={(command) => handleNewCommand(command, idx)}
            />

            <div className="ml-[52px]" data-output={idx}>
              {entry.output}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
