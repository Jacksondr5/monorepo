import { Page } from "@playwright/test";
import { clerk } from "@clerk/testing/playwright";
import { env } from "./env";

export interface AuthUser {
  email: string;
  password: string;
  role: "USER" | "ADMIN";
}

export const testUsers = {
  user: {
    email: env.PLAYWRIGHT_USER_EMAIL,
    password: env.PLAYWRIGHT_USER_PASSWORD,
    role: "USER" as const,
  },
  // TODO: Add admin user when needed
  // admin: {
  //   email: env.PLAYWRIGHT_ADMIN_EMAIL,
  //   password: env.PLAYWRIGHT_ADMIN_PASSWORD,
  //   role: "ADMIN" as const,
  // },
} as const;

/**
 * Signs in a user using Clerk's testing utilities
 * @param page - The Playwright page object
 * @param user - The user credentials to sign in with
 */
export async function signInUser(page: Page, user: AuthUser): Promise<void> {
  // Navigate to an unprotected page that loads Clerk
  await page.goto("/");

  // Wait for Clerk to load
  await clerk.loaded({ page });

  // Sign in using Clerk's test helper
  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: user.email,
      password: user.password,
    },
  });
}

/**
 * Signs out the current user using Clerk's testing utilities
 * @param page - The Playwright page object
 */
export async function signOutUser(page: Page): Promise<void> {
  // Sign out using Clerk's test helper
  await clerk.signOut({ page });
}

/**
 * Checks if a user is currently signed in
 * @param page - The Playwright page object
 * @returns Promise<boolean> - True if signed in, false otherwise
 */
export async function isUserSignedIn(page: Page): Promise<boolean> {
  try {
    // Check if UserButton is visible (indicates signed in)
    const userButton = page.locator('[data-clerk-component="UserButton"]');
    await userButton.waitFor({ state: "visible", timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensures a user is signed in, signs them in if they're not
 * @param page - The Playwright page object
 * @param user - The user credentials to sign in with
 */
export async function ensureUserSignedIn(
  page: Page,
  user: AuthUser,
): Promise<void> {
  const isSignedIn = await isUserSignedIn(page);

  if (!isSignedIn) {
    await signInUser(page, user);
  }
}

/**
 * Ensures a user is signed out, signs them out if they're not
 * @param page - The Playwright page object
 */
export async function ensureUserSignedOut(page: Page): Promise<void> {
  const isSignedIn = await isUserSignedIn(page);

  if (isSignedIn) {
    await signOutUser(page);
  }
}
