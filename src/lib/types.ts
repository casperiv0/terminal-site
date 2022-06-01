export enum CommandStatus {
  Init = "init",
  Succeeded = "succeeded",
  Failed = "failed",
}

export interface CommandEntry {
  output: JSX.Element | string | null;
  command: string | null | undefined;
  status?: CommandStatus;
  args?: string[];
}
