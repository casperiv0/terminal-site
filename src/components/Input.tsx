import * as React from "react";
import { ArrowRight } from "react-bootstrap-icons";
import { CommandEntry, CommandStatus } from "../App";
import { useHistory } from "../hooks/useHistory";
import { classNames } from "../lib/classNames";
import { Command } from "../lib/Command";
import { getCommandName } from "../lib/utils";

interface Props {
  entry: CommandEntry | null;
  commandMap: Map<string, Command>;
  handleNewCommand(args: string[]): void;
}

let hasAskedForPassword = false;

export function Input({ entry, commandMap, handleNewCommand }: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const passwordRef = React.useRef<HTMLInputElement | null>(null);
  const history = useHistory();

  const [lastCommandCount, setLastCommandCount] = React.useState(1);
  const [currentCommand, setCurrentCommand] = React.useState<string>(entry?.command ?? "");
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const [askForPassword, setAskForPassword] = React.useState(false);
  const [password, setPassword] = React.useState("");

  const { isSudo, commandName } = getCommandName(currentCommand.split(" "));
  const isValidCommand = commandMap.has(commandName);

  React.useEffect(() => {
    handleInputAreaClick();
  }, [entry]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!entry) {
      setCurrentCommand("");
      return;
    }

    if (entry.command) {
      setCurrentCommand(entry.command);
    }
  }, [entry]);

  function handleInputAreaClick() {
    if (entry || askForPassword) return;

    inputRef.current?.focus();
    setIsFocused(true);
  }

  function handlePasswordKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleInputKeydown(event, password);
    }
  }

  function handleInputKeydown(event: React.KeyboardEvent<HTMLInputElement>, password?: string) {
    const key = event.key;
    const ctrlKey = event.ctrlKey;

    if (key === "l" && ctrlKey) {
      event.preventDefault();
      handleNewCommand(["clear"]);
    }

    if (key === "c" && ctrlKey) {
      event.preventDefault();

      setCurrentCommand("");
      setLastCommandCount(1);
      handleNewCommand([""]);
    }

    if (key === "Enter") {
      if (isSudo && !password && !hasAskedForPassword) {
        setAskForPassword(true);
        setIsFocused(false);
        hasAskedForPassword = true;

        setTimeout(() => {
          passwordRef.current?.focus();
        }, 50);

        return;
      }

      handleNewCommand(currentCommand.split(" "));

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
      const commands = Array.from(commandMap.keys());

      const command = commands.find((command) => command.startsWith(commandName));
      if (command) {
        setCurrentCommand(`${isSudo ? "sudo " : ""}${command}`);
      }
    }

    handleInputAreaClick();
  }

  return (
    <div
      onClick={handleInputAreaClick}
      className={classNames("w-full p-3", askForPassword ? "h-16" : "h-10")}
    >
      <div className="flex items-center h-4">
        <span className="mr-2">
          <ArrowRight
            className={classNames(
              "fill-current",
              entry
                ? entry.status === CommandStatus.Failed
                  ? "text-red-500"
                  : "text-green-500"
                : "text-slate-300",
            )}
            width={15}
          />
        </span>
        <span className="mr-2 text-blue-300">~</span>
        <span
          className={classNames(
            isValidCommand ? "text-green-500" : "text-red-500",
            "whitespace-pre-wrap",
          )}
        >
          {currentCommand}
        </span>
        {(entry && typeof entry.command === "undefined") || entry?.command ? null : (
          <span
            data-cursor
            className={classNames(
              "ml-0.5 block w-2.5 h-[18px] bg-[#464e57]",
              isFocused && "animate-blink",
            )}
          />
        )}
      </div>

      {askForPassword ? (
        <div className="mt-1 block ml-10">
          <span>[sudo] password for Dev-CasperTheGhost:</span>
          <input
            ref={passwordRef}
            type="password"
            className="ml-2 bg-transparent outline-none"
            autoComplete="off"
            aria-autocomplete="none"
            onKeyDown={handlePasswordKeyDown}
            value={password}
            onChange={(ev) => setPassword(ev.currentTarget.value)}
          />
        </div>
      ) : null}

      <input
        type="text"
        autoFocus
        disabled={askForPassword || !!entry?.command}
        onBlur={() => setIsFocused(false)}
        ref={inputRef}
        className="opacity-0 pointer-events-none !h-0 !w-0"
        value={currentCommand}
        onChange={(ev) => setCurrentCommand(ev.currentTarget.value.toLowerCase())}
        onKeyDown={(ev) => handleInputKeydown(ev, password)}
      />
    </div>
  );
}
