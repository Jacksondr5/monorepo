import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    CERTIFICATE_DIR: z.string(),
    PRINTER_HOST: z.string().url(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
