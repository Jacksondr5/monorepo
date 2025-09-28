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
  // Admin user can be added when needed
  // admin: {
  //   email: env.PLAYWRIGHT_ADMIN_EMAIL,
  //   password: env.PLAYWRIGHT_ADMIN_PASSWORD,
  //   role: "ADMIN" as const,
  // },
} as const;

export async function signInUser(page: Page, user: AuthUser): Promise<void> {
  await page.goto("/");
  await clerk.loaded({ page });
  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: user.email,
      password: user.password,
    },
  });
}

export async function signOutUser(page: Page): Promise<void> {
  await clerk.signOut({ page });
}

export async function isUserSignedIn(page: Page): Promise<boolean> {
  try {
    const userButton = page.locator('[data-clerk-component="UserButton"]');
    await userButton.waitFor({ state: "visible", timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

export async function ensureUserSignedIn(
  page: Page,
  user: AuthUser,
): Promise<void> {
  const isSignedIn = await isUserSignedIn(page);
  if (!isSignedIn) {
    await signInUser(page, user);
  }
}

export async function ensureUserSignedOut(page: Page): Promise<void> {
  const isSignedIn = await isUserSignedIn(page);
  if (isSignedIn) {
    await signOutUser(page);
  }
}
