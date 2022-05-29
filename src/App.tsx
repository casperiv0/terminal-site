import * as React from "react";
import { Input } from "./components/Input";
import { Command, loadCommands } from "./lib/Command";
import { commandNotFound, initBanner } from "./lib/outputs";
import { getCommandName } from "./lib/utils";

export enum CommandStatus {
  Succeeded,
  Failed,
}

export interface CommandEntry {
  output: JSX.Element | string | null;
  command: string | null | undefined;
  status?: CommandStatus;
}

export default function App() {
  const [commandMap, setCommandMap] = React.useState(new Map<string, Command>());
  const [entries, setEntries] = React.useState<CommandEntry[]>([
    { output: initBanner({ command: "" }), command: undefined },
    { output: null, command: null },
  ]);

  const _loadCommands = React.useCallback(async () => {
    setCommandMap(await loadCommands());
  }, []);

  React.useEffect(() => {
    _loadCommands();
  }, [_loadCommands]);

  function handleNewCommand(args: string[], idx: number) {
    const [, ...commandArgs] = args;

    const { commandName, isSudo } = getCommandName(args);
    const fullCommand = isSudo ? `sudo ${commandName}` : commandName;

    const commandFunctionOptions = { command: commandName };

    if (commandName === "clear") {
      return setEntries([{ command: null, output: null, status: CommandStatus.Succeeded }]);
    }

    if (commandName.trim() === "") {
      return _addCommandToEntries(idx, {
        status: CommandStatus.Succeeded,
        command: undefined,
        output: null,
      });
    }

    const command = commandMap.get(commandName);
    if (!command) {
      _addCommandToEntries(idx, {
        status: CommandStatus.Failed,
        command: fullCommand,
        output: commandNotFound(commandFunctionOptions),
      });

      return;
    }

    const output = command.render({ command: commandName, args: commandArgs });
    _addCommandToEntries(idx, {
      status: CommandStatus.Succeeded,
      command: fullCommand,
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
        const commandEntry = entry.command !== null ? entry : null;
        const showInputField = typeof entry.command !== "undefined" || !entry.output;

        return (
          <div key={idx} data-status={commandEntry?.status} data-entry={idx}>
            {showInputField ? (
              <Input
                entry={commandEntry}
                handleNewCommand={(command) => handleNewCommand(command, idx)}
              />
            ) : null}

            <div
              style={{ lineHeight: "normal" }}
              className="ml-[52px] whitespace-pre-wrap"
              data-output={idx}
            >
              {entry.output}
            </div>
          </div>
        );
      })}
    </div>
  );
}
