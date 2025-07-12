import { type Config } from "drizzle-kit";

const databaseUrl = process.env.POSTGRES_URL;
if (!databaseUrl) {
  throw new Error("POSTGRES_URL is not set");
}

export default {
  schema: "./src/server/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
    ssl: "require",
  },
  tablesFilter: [`todo*`],
} satisfies Config;
