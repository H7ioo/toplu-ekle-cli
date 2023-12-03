import { registerPrompts } from "./lib/utils";
import { main } from "./main";

registerPrompts();

// TODO: Logs for the errors
// TODO: Logs for each product created

(async () => {
  await main();
})();
