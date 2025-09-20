import type { ExecutorContext } from "@nx/devkit";
import { join } from "path";

export function getProjectSlug(context: ExecutorContext): string {
  const slug = context.projectName?.split("/")[1];
  if (!slug)
    throw new Error(`Invalid project name format: ${context.projectName}`);
  return slug;
}

export function getAppFromE2eProject(e2eProjectName: string): string {
  return e2eProjectName.replace(/-e2e$/, "");
}

export function getProjectRoot(context: ExecutorContext): string {
  const project = getProjectSlug(context);
  return join(context.root, "apps", project);
}
