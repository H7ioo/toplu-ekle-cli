import z from "zod";

import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NOTION_SECRET: z.string().min(1),
  NOTION_DATABASE: z.string().min(1),
  LOG_LEVEL: z.string().optional(),
  TRENDYOL_USER_AGENT: z.string().optional(),
  TRENDYOL_USERNAME: z.string().optional(),
  TRENDYOL_PASSWORD: z.string().optional(),
});

export const env = envSchema.parse(process.env);
