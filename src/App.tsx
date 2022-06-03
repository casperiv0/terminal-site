import * as React from "react";
import { Input } from "./components/Input";
import { useCommands } from "./hooks/useCommands";
import { loadCommands } from "./lib/Command";

export default function App() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const commands = useCommands();

  const _loadCommands = React.useCallback(async () => {
    commands.state.setCommandMap(await loadCommands());
  }, []); // eslint-disable-line

  React.useEffect(() => {
    _loadCommands();
  }, [_loadCommands]);

  return (
    <div ref={containerRef} className="m-12">
      {commands.state.entries.map((entry, idx) => {
        const commandEntry = entry.command !== null ? entry : null;
        const showInputField = typeof entry.command !== "undefined" || !entry.output;

        return (
          <div key={idx} data-status={commandEntry?.status} data-entry={idx}>
            {showInputField ? (
              <Input
                entry={commandEntry}
                handleNewCommand={(command) => commands.handleNewCommand(command, idx)}
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
