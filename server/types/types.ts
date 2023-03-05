import { z } from "zod";

export const envSchema = z.object({
  SECRET: z.string(),
  DB_URL: z.string(),
  CLOUDFLARE_ID: z.string(),
  R2_ACCESS_ID: z.string(),
  R2_SECRET_KEY: z.string(),
  R2_BUCKET_NAME: z.string(),
  R2_PUBLIC_URL: z.string(),
});

export type File = Express.MulterS3.File;
