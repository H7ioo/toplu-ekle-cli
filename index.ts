import { registerPrompts } from "./lib/utils";
import { main } from "./main";

registerPrompts();

(async () => {
  await main();
})();
