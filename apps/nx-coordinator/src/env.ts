import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Environment variables for the Nx Coordinator app
 * Required variables:
 * - NEXT_PUBLIC_CLERK_FRONTEND_API_URL: Clerk frontend API URL
 * - NEXT_PUBLIC_CONVEX_URL: Convex API URL for client-side
 * - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Clerk publishable key
 */
export const env = createEnv({
  client: {
    NEXT_PUBLIC_CLERK_FRONTEND_API_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CLERK_FRONTEND_API_URL:
      process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  },
  server: {},
});
