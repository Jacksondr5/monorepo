import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Environment variables for the hackathon application
 *
 * Required variables:
 * - CONVEX_DEPLOYMENT: Convex deployment identifier (server-only)
 * - NEXT_PUBLIC_CLERK_FRONTEND_API_URL: Clerk frontend API URL for authentication
 * - NEXT_PUBLIC_CONVEX_URL: Convex API URL for client-side queries
 * - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Clerk publishable key for auth components
 * - NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL: Clerk sign up force redirect URL
 * - NEXT_PUBLIC_POSTHOG_KEY: PostHog publishable key for client-side analytics
 * - NEXT_PUBLIC_POSTHOG_HOST: PostHog host URL (e.g. https://app.posthog.com)
 *
 * Set these in a .env.local file at the root of the hackathon app
 */
export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_CLERK_FRONTEND_API_URL: z.string().min(1),
    NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
    NEXT_PUBLIC_POSTHOG_ENABLED: z
      .string()
      // only allow "true" or "false"
      .refine((s) => s === "true" || s === "false")
      // transform to boolean
      .transform((s) => s === "true"),
    NEXT_PUBLIC_POSTHOG_DEBUG: z
      .string()
      // only allow "true" or "false"
      .refine((s) => s === "true" || s === "false")
      // transform to boolean
      .transform((s) => s === "true"),
    NEXT_PUBLIC_ENV: z.string().min(1),
    NEXT_PUBLIC_SENTRY_DSN: z.string().min(1),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_CLERK_FRONTEND_API_URL:
      process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_POSTHOG_ENABLED: process.env.NEXT_PUBLIC_POSTHOG_ENABLED,
    NEXT_PUBLIC_POSTHOG_DEBUG: process.env.NEXT_PUBLIC_POSTHOG_DEBUG,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});
