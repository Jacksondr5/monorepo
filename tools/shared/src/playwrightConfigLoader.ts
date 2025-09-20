import { existsSync, readFileSync } from "fs";
import { join } from "path";

export function getBaseURL(dirname: string, projectName: string): string {
  // 1. Check environment variable first
  if (process.env.BASE_URL) {
    console.log(
      "Using BASE_URL from environment variable:",
      process.env.BASE_URL,
    );
    return process.env.BASE_URL;
  }

  // 2. Check .vercel-url file
  const vercelUrlPath = join(
    dirname,
    `../../vercel-urls/${projectName}.vercel-url`,
  );
  console.log("Checking .vercel-url file:", vercelUrlPath);
  if (existsSync(vercelUrlPath)) {
    console.log("Found .vercel-url file:", vercelUrlPath);
    try {
      const url = readFileSync(vercelUrlPath, "utf-8").trim();
      if (url) {
        console.log("Using BASE_URL from .vercel-url file:", url);
        if (!url.startsWith("http")) {
          return `https://${url}`;
        }
        return url;
      }
    } catch (error) {
      console.warn("Failed to read .vercel-url file:", error);
    }
  }

  // 3. Fall back to localhost:3000
  console.log("Using BASE_URL from localhost:3000");
  return "http://localhost:3000";
}
