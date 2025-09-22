import { clerkSetup } from "@clerk/testing/playwright";
import { test as setup } from "@playwright/test";
import "../src/env";

setup.describe.configure({ mode: "serial" });

setup("global setup", async () => {
  await clerkSetup();
});
