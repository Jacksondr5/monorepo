import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Environment variables for the packing list application
 *
 * Required variables:
 * - CONVEX_DEPLOYMENT: Convex deployment identifier (server-only)
 * - NEXT_PUBLIC_CLERK_FRONTEND_API_URL: Clerk frontend API URL for authentication
 * - NEXT_PUBLIC_CONVEX_URL: Convex API URL for client-side queries
 * - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Clerk publishable key for auth components
 *
 * Set these in a .env.local file at the root of the packing list app
 */
export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_CLERK_FRONTEND_API_URL: z.string().min(1),
    NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_CLERK_FRONTEND_API_URL:
      process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});
