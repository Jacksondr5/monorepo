import { env } from "../src/env";

const config = {
  providers: [
    {
      domain: env.NEXT_PUBLIC_CLERK_ISSUER_URL,
      applicationID: "convex",
    },
  ],
};

export default config;
