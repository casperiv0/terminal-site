import { Command } from "../Command";

export default class RepoCommand extends Command {
  constructor() {
    super({ name: "repo" });
  }

  render(): string | JSX.Element {
    return (
      <p>
        All the code for this project{" "}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline font-semibold"
          href="https://github.com/dev-caspertheghost/terminal-site"
        >
          can be found on GitHub
        </a>
      </p>
    );
  }
}
