"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    SECRET: zod_1.z.string(),
    DB_URL: zod_1.z.string(),
    CLOUDFLARE_ID: zod_1.z.string(),
    R2_ACCESS_ID: zod_1.z.string(),
    R2_SECRET_KEY: zod_1.z.string(),
    R2_BUCKET_NAME: zod_1.z.string(),
    R2_PUBLIC_URL: zod_1.z.string(),
    SEED_USERNAME: zod_1.z.string(),
    SEED_PASSWORD: zod_1.z.string(),
});
