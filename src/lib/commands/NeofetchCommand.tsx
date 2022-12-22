import { Command } from "../Command";

export default class NeofetchCommand extends Command {
  private UPTIME = "8 hours, 10 mins";

  constructor() {
    super({ name: "neofetch" });
  }

  render(): string | JSX.Element {
    return (
      <p>
        {`
            .-/+oossssoo+/-.               casper@DESKTOP
        \`:+ssssssssssssssssss+:\`           ----------------------
      -+ssssssssssssssssssyyssss+-         Uptime: ${this.UPTIME}
    .ossssssssssssssssssdMMMNysssso.       OS: Ubuntu [Windows 10] x86_64
   /ssssssssssshdmmNNmmyNMMMMhssssss/      Kernel: WSL2
  +ssssssssshmydMMMMMMMNddddyssssssss+     Memory: 32 GB
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    Shell: zsh
.ssssssssdMMMNhsssssssssshNMMMdssssssss.   CPU: AMD Ryzen 7 3800X @ 4GHz
+sssshhhyNMMNyssssssssssssyNMMMysssssss+   Terminal: Windows Terminal
ossyNMMMNyMMhsssssssssssssshmmmhssssssso
ossyNMMMNyMMhsssssssssssssshmmmhssssssso
+sssshhhyNMMNyssssssssssssyNMMMysssssss+
.ssssssssdMMMNhsssssssssshNMMMdssssssss.
 /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/
  +sssssssssdmydMMMMMMMMddddyssssssss+
   /ssssssssssshdmNNNNmyNMMMMhssssss/
    .ossssssssssssssssssdMMMNysssso.
      -+sssssssssssssssssyyyssss+-
        \`:+ssssssssssssssssss+:\`
            .-/+oossssoo+/-.
`}
      </p>
    );
  }
}
