import type { Page } from "@playwright/test";

export const addVercelBypassHeader = async (page: Page, baseURL?: string) => {
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (!secret || !baseURL) {
    return;
  }

  const { host } = new URL(baseURL);
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.host === host) {
      await route.continue({
        headers: {
          ...route.request().headers(),
          "x-vercel-protection-bypass": secret,
          "x-vercel-set-bypass-cookie": "samesitenone",
        },
      });
    } else {
      await route.continue();
    }
  });
};
