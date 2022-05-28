import * as React from "react";
import { Input } from "./components/Input";
import { useHistory } from "./hooks/useHistory";
import { commandNotFound, helpCommand } from "./lib/commands";

export enum CommandStatus {
  Succeeded,
  Failed,
}

export interface CommandEntry {
  output: string | null;
  command: string | null;
  status?: CommandStatus;
}

function App() {
  const [entries, setEntries] = React.useState<CommandEntry[]>([{ output: null, command: null }]);

  function handleNewCommand(command: string, idx: number) {
    if (command === "clear") {
      return setEntries([{ command: null, output: null, status: CommandStatus.Succeeded }]);
    }

    if (command === "help") {
      return _addCommandToEntries(idx, {
        status: CommandStatus.Succeeded,
        command,
        output: helpCommand(),
      });
    }

    _addCommandToEntries(idx, {
      status: CommandStatus.Failed,
      command,
      output: commandNotFound(),
    });
  }

  function _addCommandToEntries(idx: number, entry: CommandEntry) {
    const newEntries = [...entries];
    newEntries[idx] = entry;
    setEntries([...newEntries, { command: null, output: null }]);
  }

  return (
    <div className="m-12 font-mono">
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
