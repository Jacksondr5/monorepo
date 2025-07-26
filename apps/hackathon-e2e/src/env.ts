import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import "dotenv/config";
import DopplerSDK, { type SecretsListResponse } from "@dopplerhq/node-sdk";

const processEnv = createEnv({
  server: {
    DOPPLER_TOKEN: z.string().min(1),
    DOPPLER_ENV: z.string().min(1),
  },
  runtimeEnv: process.env,
});

type SecretGroup = Required<SecretsListResponse>["secrets"];
type Secret = Required<SecretGroup["USER"]>;

const doppler = new DopplerSDK({ accessToken: processEnv.DOPPLER_TOKEN });
const result = await doppler.secrets.list("ci", processEnv.DOPPLER_ENV);
const secrets = result.secrets as Record<string, Secret> | undefined;
if (!secrets) {
  throw new Error("No secrets found");
}
export const env = createEnv({
  server: {
    BASE_URL: z.string().url(),
    CLERK_PUBLISHABLE_KEY: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    PLAYWRIGHT_USER_EMAIL: z.string().email(),
    PLAYWRIGHT_USER_PASSWORD: z.string().min(1),
  },
  runtimeEnv: {
    BASE_URL: process.env.BASE_URL,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    PLAYWRIGHT_USER_EMAIL: process.env.PLAYWRIGHT_USER_EMAIL,
    PLAYWRIGHT_USER_PASSWORD: process.env.PLAYWRIGHT_USER_PASSWORD,
  },
});
