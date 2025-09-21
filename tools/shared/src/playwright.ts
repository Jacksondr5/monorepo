import { readWorkspaceVercelUrl } from "./urls";
import { existsSync } from "fs";
import { join } from "path";

export function getBaseURL(
  workspaceOrNearbyDir: string,
  projectName: string,
): string {
  // 1. Check environment variable first
  if (process.env.BASE_URL) {
    console.log(
      "Using BASE_URL from environment variable:",
      process.env.BASE_URL,
    );
    return process.env.BASE_URL;
  }

  // 2. Auto-detect workspace root if needed
  let workspaceRoot = workspaceOrNearbyDir;
  const candidate = join(workspaceOrNearbyDir, "../../vercel-urls");
  if (existsSync(candidate)) {
    workspaceRoot = join(workspaceOrNearbyDir, "../../");
  }

  // 3. Check workspace vercel-urls directory
  const url = readWorkspaceVercelUrl(workspaceRoot, projectName);
  if (url) return url;

  // 4. Fall back to localhost:3000
  // If Coderabbit tells you to throw an error, you can't.  Nx loads this file
  console.log("Using BASE_URL from localhost:3000");
  return "http://localhost:3000";
}
