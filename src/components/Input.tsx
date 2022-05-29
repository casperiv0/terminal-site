import * as React from "react";
import { ArrowRight } from "react-bootstrap-icons";
import { CommandEntry, CommandStatus } from "../App";
import { useHistory } from "../hooks/useHistory";
import { classNames } from "../lib/classNames";
import { COMMAND_LIST } from "../lib/outputs";

interface Props {
  entry: CommandEntry | null;
  handleNewCommand(args: string[]): void;
}

export function Input({ entry, handleNewCommand }: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const history = useHistory();

  const [lastCommandIndex, setLastCommandIndex] = React.useState(0);
  const [currentCommand, setCurrentCommand] = React.useState<string>(entry?.command ?? "");
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const [commandName] = currentCommand.split(" ");
  const isValidCommand = COMMAND_LIST.includes(commandName);

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
    if (entry) return;

    inputRef.current?.focus();
    setIsFocused(true);
  }

  function handleInputKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
    const key = event.key;
    const ctrlKey = event.ctrlKey;

    if (key === "l" && ctrlKey) {
      event.preventDefault();
      handleNewCommand(["clear"]);
    }

    if (key === "c" && ctrlKey) {
      event.preventDefault();
      console.log("here");

      setCurrentCommand("");
      setLastCommandIndex(0);
      handleNewCommand([""]);
    }

    if (key === "Enter") {
      handleNewCommand(currentCommand.split(" "));

      if (currentCommand) {
        setCurrentCommand("");
        setLastCommandIndex(0);
        history.addCommandToHistory(currentCommand);
      }
    }

    if (key === "ArrowUp") {
      const lastEnteredCommand = history.getPreviousCommand(lastCommandIndex);

      if (lastEnteredCommand) {
        setCurrentCommand(lastEnteredCommand);
        setLastCommandIndex((p) => p + 1);
      }
    }

    if (key === "ArrowDown") {
      const index = lastCommandIndex - 1;

      if (index < 0) {
        setCurrentCommand("");
        setLastCommandIndex(0);
      } else {
        setLastCommandIndex((p) => p - 1);
        const lastEnteredCommand = history.getNextCommand(lastCommandIndex);

        if (lastEnteredCommand) {
          setCurrentCommand(lastEnteredCommand);
        }
      }
    }

    if (key === "Tab") {
      event.preventDefault();
      if (currentCommand.length <= 0) return;

      const command = COMMAND_LIST.find((command) => command.startsWith(currentCommand));
      if (command) {
        setCurrentCommand(command);
      }
    }

    handleInputAreaClick();
  }

  return (
    <div onClick={handleInputAreaClick} className="relative w-full h-10 p-3">
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
            isValidCommand ? "text-green-300" : "text-red-300",
            "whitespace-pre-wrap",
          )}
        >
          {currentCommand}
        </span>
        {(entry && typeof entry.command === "undefined") || entry?.command ? null : (
          <span
            data-cursor
            className={classNames(
              "ml-0.5 block w-2.5 h-[18px] bg-white",
              isFocused && "animate-blink",
            )}
          />
        )}
      </div>

      <input
        autoFocus
        disabled={!!entry?.command}
        onBlur={() => setIsFocused(false)}
        ref={inputRef}
        className="opacity-0 pointer-events-none !h-0 !w-0"
        value={currentCommand}
        onChange={(ev) => setCurrentCommand(ev.currentTarget.value.toLowerCase())}
        onKeyDown={handleInputKeydown}
      />
    </div>
  );
}
