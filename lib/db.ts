import { Client } from "@notionhq/client";
import { env } from "./env";

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedNotionClient: Client | null;
}

if (!global.cachedNotionClient) {
  global.cachedNotionClient = new Client({
    auth: env.NOTION_SECRET,
  });
}
const notionClient = global.cachedNotionClient;

export const notionDB = notionClient;
