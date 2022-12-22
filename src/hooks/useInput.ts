import React from "react";
import type { CommandEntry } from "../lib/types";
import { getCommandName } from "../lib/utils";
import { useCommands } from "./useCommands";
import { useHistory } from "./useHistory";

interface UseInputOptions {
  inputRef: React.RefObject<HTMLInputElement>;
  passwordRef: React.RefObject<HTMLInputElement>;
  entry: CommandEntry | null;
  handleNewCommand(args: string[]): void;
}

let hasAskedForPassword = false;

export function useInput(options: UseInputOptions) {
  const history = useHistory();
  const commands = useCommands();
  const commandMap = commands.state.commandMap;

  const [lastCommandCount, setLastCommandCount] = React.useState(1);
  const [currentCommand, setCurrentCommand] = React.useState<string>(
    getCommandFromEntry(options.entry),
  );
  const [askForPassword, setAskForPassword] = React.useState(false);

  React.useEffect(() => {
    const handler = () => {
      options.inputRef.current?.focus();
    };

    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  }, [options.inputRef]);

  React.useEffect(() => {
    setCurrentCommand(getCommandFromEntry(options.entry));
  }, [options.entry]);

  function handleInputKeydown(event: React.KeyboardEvent<HTMLInputElement>, password?: string) {
    const key = event.key;
    const ctrlKey = event.ctrlKey;

    if (key === "l" && ctrlKey) {
      event.preventDefault();
      setAskForPassword(false);
      options.handleNewCommand(["clear"]);
    }

    if (key === "c" && ctrlKey) {
      event.preventDefault();

      setCurrentCommand("");
      setLastCommandCount(1);
      options.handleNewCommand([""]);
    }

    if (key === "Enter") {
      if (isSudo && !password && !hasAskedForPassword) {
        setAskForPassword(true);
        hasAskedForPassword = true;

        setTimeout(() => {
          options.passwordRef.current?.focus();
        }, 50);

        return;
      }

      options.handleNewCommand(currentCommand.split(" "));

      if (currentCommand) {
        setCurrentCommand("");
        setLastCommandCount(1);
        history.addCommandToHistory(currentCommand);
      }
    }

    if (key === "ArrowUp") {
      const lastEnteredCommand = history.getPreviousCommand(lastCommandCount);

      if (lastEnteredCommand) {
        setCurrentCommand(lastEnteredCommand);
        setLastCommandCount((p) => p + 1);
      }
    }

    if (key === "ArrowDown") {
      const nextEnteredCommand = history.getNextCommand(lastCommandCount);

      if (nextEnteredCommand && lastCommandCount !== 1) {
        setCurrentCommand(nextEnteredCommand);
        setLastCommandCount((p) => p + 1);
      } else {
        setLastCommandCount(1);
        setCurrentCommand("");
      }
    }

    if (key === "Tab") {
      event.preventDefault();
      if (currentCommand.length <= 0) return;
      const commandsArr = commands.commandsArr;

      const command = commandsArr.find((command) => command.startsWith(commandName));
      if (command) {
        setCurrentCommand(`${isSudo ? "sudo " : ""}${command}`);
      }
    }

    handleInputAreaClick();
  }

  function handleInputAreaClick() {
    if (options.entry || askForPassword) return;

    options.inputRef.current?.focus();
    options.inputRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const { isSudo, commandName } = getCommandName(currentCommand.split(" "));
  const isValidCommand = commandMap.has(commandName);

  const state = { currentCommand, setCurrentCommand, askForPassword };
  const command = { isSudo, commandName, isValidCommand };

  return {
    state,
    command,
    handleInputKeydown,
    handleInputAreaClick,
  };
}

function getCommandFromEntry(entry: CommandEntry | null) {
  if (!entry || !entry.command) return "";
  return `${entry.command}${entry.args ? [" ", ...entry.args].join(" ") : ""}`.trim();
}
