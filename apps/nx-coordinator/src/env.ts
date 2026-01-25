import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Environment variables for the Nx Coordinator app
 * Required variables:
 * - NEXT_PUBLIC_CONVEX_URL: Convex API URL for client-side
 */
export const env = createEnv({
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  },
  server: {},
});
