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
  return join(workspaceRoot, VERCEL_URLS_DIR, `${project}.vercel-url`);
}

export function readWorkspaceVercelUrl(
  workspaceRoot: string,
  project: string,
): string | null {
  const p = getWorkspaceVercelUrlPath(workspaceRoot, project);
  if (!existsSync(p)) return null;
  const v = readFileSync(p, "utf8").trim();
  if (!v) return null;
  return v.startsWith("http") ? v : `https://${v}`;
}

export function writeWorkspaceVercelUrl(
  workspaceRoot: string,
  project: string,
  url: string,
): void {
  try {
    const p = getWorkspaceVercelUrlPath(workspaceRoot, project);
    console.info(`Writing deployment URL to ${p} for project ${project}`);
    console.info(`URL: ${url}`);
    writeFileSync(p, url);
  } catch (error) {
    throw logAndCreateError(`Failed to write .vercel-url file: ${error}`);
  }
}

export function readConvexUrl(projectRoot: string): string {
  const p = join(projectRoot, CONVEX_URL_FILENAME);
  const v = readFileSync(p, "utf8").trim();
  if (!v) throw new Error("Empty convex url file");
  return v;
}
