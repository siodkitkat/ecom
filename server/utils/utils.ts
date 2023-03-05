import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { envSchema } from "../types";
dotenv.config();

export const env = envSchema.parse(process.env);

export const errorResponse = (message: string, error: number) => {
  return {
    message,
    error,
  };
};

export const stringToNum = (input: string, type = "int" as "float" | "int", fallback = 0) => {
  const num = type === "float" ? parseFloat(input) : parseInt(input);
  return isNaN(num) ? fallback : isNaN;
};

export const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_ID,
    secretAccessKey: env.R2_SECRET_KEY,
  },
});
