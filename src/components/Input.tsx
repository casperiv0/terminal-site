import * as React from "react";
import { ArrowRight } from "react-bootstrap-icons";
import { CommandEntry, CommandStatus } from "../App";
import { useHistory } from "../hooks/useHistory";
import { classNames } from "../lib/classNames";

interface Props {
  entry: CommandEntry | null;
  handleNewCommand(command: string): void;
}

export function Input({ entry, handleNewCommand }: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const history = useHistory();

  const [historyCount, setHistoryCount] = React.useState(0);
  const [currentCommand, setCurrentCommand] = React.useState<string>(entry?.command ?? "");
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  React.useEffect(() => {
    handleInputAreaClick();
  }, [entry]);

  React.useEffect(() => {
    if (entry?.command) {
      setCurrentCommand(entry?.command);
    } else {
      setCurrentCommand("");
    }
  }, [entry]);

  function handleInputAreaClick() {
    if (entry) return;

    inputRef.current?.focus();
    setIsFocused(true);
  }

  function handleInputKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
    const key = event.key;

    if (key === "Enter" && currentCommand) {
      history.addCommandToHistory(currentCommand);

      handleNewCommand(currentCommand);
      setCurrentCommand("");
      setHistoryCount(0);
    }

    if (key === "ArrowUp") {
      const lastEnteredCommand = history.getPreviousCommand(historyCount);
      if (lastEnteredCommand) {
        setCurrentCommand(lastEnteredCommand);
        setHistoryCount((p) => p + 1);
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
                ? entry?.status === CommandStatus.Failed
                  ? "text-red-500"
                  : "text-green-500"
                : "text-slate-300",
            )}
            width={15}
          />
        </span>
        <span className="mr-2 text-blue-300">$</span>
        <span>{currentCommand}</span>
        {entry?.command ? null : (
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
        disabled={!!entry?.command}
        onBlur={() => setIsFocused(false)}
        ref={inputRef}
        className="opacity-0 pointer-events-none !h-0 !w-0"
        value={currentCommand}
        onChange={(ev) => setCurrentCommand(ev.currentTarget.value)}
        onKeyDown={handleInputKeydown}
      />
    </div>
  );
}
