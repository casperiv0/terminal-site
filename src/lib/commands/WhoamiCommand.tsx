import { Command } from "../Command";

export default class WhoamiCommand extends Command {
  private WHOAMI = "Dev-CasperTheGhost";

  constructor() {
    super({ name: "whoami" });
  }

  render(): string | JSX.Element {
    return (
      <a
        target="_blank"
        rel="noreferrer"
        className="hover:underline"
        href="https://caspertheghost.me"
      >
        {this.WHOAMI}
      </a>
    );
  }
}
