import { Command } from "../Command";

export default class DateCommand extends Command {
  constructor() {
    super({ name: "date" });
  }

  render(): string | JSX.Element {
    const date = new Date();

    return (
      <p>{Intl.DateTimeFormat(undefined, { dateStyle: "long", timeStyle: "long" }).format(date)}</p>
    );
  }
}
