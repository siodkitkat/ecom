import { z } from "zod";

export const envSchema = z.object({
  SECRET: z.string(),
  DB_URL: z.string(),
});
