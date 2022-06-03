import * as React from "react";
import create from "zustand";
import { Command } from "../lib/Command";
import { CommandEntry, CommandStatus } from "../lib/types";
import { commandNotFound, getCommandName, initBanner } from "../lib/utils";

interface CommandStore {
  commandMap: Map<string, Command>;
  setCommandMap(map: CommandStore["commandMap"]): void;

  entries: CommandEntry[];
  setEntries(entries: CommandEntry[]): void;
}

const DEFAULT_ENTRIES: CommandEntry[] = [
  { output: initBanner({ command: "" }), command: undefined, status: CommandStatus.Init },
  { output: null, command: null },
];

const useCommandsStore = create<CommandStore>((set) => ({
  commandMap: new Map(),
  setCommandMap: (map) => set({ commandMap: map }),

  entries: DEFAULT_ENTRIES,
  setEntries: (entries) => set({ entries }),
}));

export function useCommands() {
  const state = useCommandsStore();
  const commandsArr = React.useMemo(() => Array.from(state.commandMap.keys()), [state.commandMap]);

  function handleNewCommand(args: string[], idx: number) {
    const { commandName, commandArgs, isSudo } = getCommandName(args);
    const fullCommand = isSudo ? `sudo ${commandName}` : commandName;
    const commandFunctionOptions = { command: commandName };

    if (commandName === "clear") {
      return state.setEntries([{ command: null, output: null, status: CommandStatus.Succeeded }]);
    }

    if (commandName.trim() === "") {
      return _addCommandToEntries(idx, {
        status: CommandStatus.Succeeded,
        command: undefined,
        output: null,
        args: commandArgs,
      });
    }

    const command = state.commandMap.get(commandName);
    if (!command) {
      _addCommandToEntries(idx, {
        status: CommandStatus.Failed,
        command: fullCommand,
        output: commandNotFound(commandFunctionOptions),
        args: commandArgs,
      });

      return;
    }

    const output = command.render({
      commands: commandsArr,
      command: commandName,
    });
    _addCommandToEntries(idx, {
      status: CommandStatus.Succeeded,
      command: fullCommand,
      output,
      args: commandArgs,
    });
  }

  function _addCommandToEntries(idx: number, entry: CommandEntry) {
    const newEntries = [...state.entries];
    newEntries[idx] = entry;
    state.setEntries([...newEntries, { command: null, output: null }]);
  }

  return {
    state,
    commandsArr,
    handleNewCommand,
  };
}
