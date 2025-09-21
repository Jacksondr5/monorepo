import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  server: {
    CLERK_PUBLISHABLE_KEY: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    PLAYWRIGHT_USER_EMAIL: z.string().email(),
    PLAYWRIGHT_USER_PASSWORD: z.string().min(1),
  },
  runtimeEnv: {
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    PLAYWRIGHT_USER_EMAIL: process.env.PLAYWRIGHT_USER_EMAIL,
    PLAYWRIGHT_USER_PASSWORD: process.env.PLAYWRIGHT_USER_PASSWORD,
  },
});
