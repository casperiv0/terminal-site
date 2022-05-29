import { Command, CommandRenderOptions } from "../Command";

export default class HttpCatCommand extends Command {
  constructor() {
    super({ name: "http-cat" });
  }

  render({ args }: CommandRenderOptions): string | JSX.Element {
    const [statusCodeStr] = args;
    const statusCode = Number(statusCodeStr);

    if (isNaN(statusCode)) {
      return <p>invalid status code</p>;
    }

    const url = `https://http.cat/${statusCode}.jpg`;

    return <img src={url} />;
  }
}
