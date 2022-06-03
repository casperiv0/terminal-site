import * as React from "react";
import { useInput } from "../hooks/useInput";
import { classNames } from "../lib/utils";
import { CommandEntry, CommandStatus } from "../lib/types";

interface Props {
  entry: CommandEntry | null;
  handleNewCommand(args: string[]): void;
}

export function Input({ entry, handleNewCommand }: Props) {
  const [password, setPassword] = React.useState("");

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const passwordRef = React.useRef<HTMLInputElement | null>(null);

  const input = useInput({
    entry,
    inputRef,
    passwordRef,
    handleNewCommand,
  });

  const arrowTextColor = entry
    ? entry.status === CommandStatus.Failed
      ? "text-red-500"
      : "text-green-500"
    : "text-slate-300";

  React.useEffect(() => {
    input.handleInputAreaClick();
  }, [entry]); // eslint-disable-line react-hooks/exhaustive-deps

  function handlePasswordKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      input.handleInputKeydown(event, password);
    }
  }

  return (
    <div
      onClick={input.handleInputAreaClick}
      className={classNames("w-full p-3", input.state.askForPassword ? "h-16" : "h-10")}
    >
      <div className="flex items-center h-4">
        <span className="mr-2">
          <ArrowRight className={classNames("fill-current", arrowTextColor)} width={15} />
        </span>
        <span className="mr-2 text-blue-300">~</span>

        <input
          spellCheck="false"
          type="text"
          autoFocus
          disabled={input.state.askForPassword || !!entry?.command}
          ref={inputRef}
          className={classNames(
            "bg-transparent outline-none",
            input.state.currentCommand
              ? input.command.isValidCommand
                ? "text-green-500"
                : "text-red-500"
              : "text-slate-300",
          )}
          value={input.state.currentCommand}
          onChange={(ev) => input.state.setCurrentCommand(ev.currentTarget.value.toLowerCase())}
          onKeyDown={(ev) => input.handleInputKeydown(ev, password)}
          size={input.state.currentCommand.length}
        />
      </div>

      {input.state.askForPassword ? (
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
    </div>
  );
}

function ArrowRight(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
      />
    </svg>
  );
}
