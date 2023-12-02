import z from "zod";

import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NOTION_SECRET: z.string().min(1),
  NOTION_DATABASE: z.string().min(1),
});

export const env = envSchema.parse(process.env);
