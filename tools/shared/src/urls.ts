import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { logAndCreateError } from "./logAndCreateError";

export const VERCEL_URLS_DIR = "vercel-urls";
export const VERCEL_URL_FILENAME = ".vercel-url";
export const CONVEX_URL_FILENAME = ".convex-url";

export function getWorkspaceVercelUrlPath(
  workspaceRoot: string,
  project: string,
): string {
  return join(
    workspaceRoot,
    VERCEL_URLS_DIR,
    `${project}${VERCEL_URL_FILENAME}`,
  );
}

export function readWorkspaceVercelUrl(
  workspaceRoot: string,
  project: string,
): string | null {
  const vercelUrlFilePath = getWorkspaceVercelUrlPath(workspaceRoot, project);
  if (!existsSync(vercelUrlFilePath)) return null;
  const vercelUrl = readFileSync(vercelUrlFilePath, "utf8").trim();
  if (!vercelUrl) return null;
  return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
}

export function writeWorkspaceVercelUrl(
  workspaceRoot: string,
  project: string,
  url: string,
): void {
  try {
    const vercelUrlFilePath = getWorkspaceVercelUrlPath(workspaceRoot, project);
    console.info(
      `Writing deployment URL to ${vercelUrlFilePath} for project ${project}`,
    );
    console.info(`URL: ${url}`);
    writeFileSync(vercelUrlFilePath, url);
  } catch (error) {
    throw logAndCreateError(`Failed to write vercel url file: ${error}`);
  }
}

export function readConvexUrl(projectRoot: string): string | null {
  const convexFilePath = join(projectRoot, CONVEX_URL_FILENAME);
  if (!existsSync(convexFilePath)) {
    return null;
  }
  const convexUrl = readFileSync(convexFilePath, "utf8").trim();
  if (!convexUrl) throw logAndCreateError("Empty convex url file");
  return convexUrl;
}
