import { Command } from "../Command";

export default class AboutCommand extends Command {
  constructor() {
    super({ name: "about" });
  }

  render(): string | JSX.Element {
    return <p>{"I'm Casper, a front-end focused web developer with over 3 years experience."}</p>;
  }
}
