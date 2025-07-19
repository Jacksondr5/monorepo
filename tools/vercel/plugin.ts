import { createNodesFromFiles } from "@nx/devkit";
import { CreateNodesContextV2 } from "@nx/devkit";
import { TargetConfiguration } from "@nx/devkit";
import { CreateNodesV2 } from "@nx/devkit";
import { readdirSync } from "fs";
import { dirname, join } from "path";

export interface VercelPluginOptions {
  projectName: string;
}

export const createNodesV2: CreateNodesV2<VercelPluginOptions> = [
  "**/next.config.ts",
  async (configFiles, options, context) => {
    return await createNodesFromFiles(
      (configFile, options, context) =>
        createNodesInternal(configFile, options, context),
      configFiles,
      options,
      context,
    );
  },
];

async function createNodesInternal(
  matchingFile: string,
  _: VercelPluginOptions | undefined,
  context: CreateNodesContextV2,
) {
  const projectRoot = dirname(matchingFile);

  // Do not create a project if package.json or project.json isn't there.
  const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));
  if (
    !siblingFiles.includes("package.json") &&
    !siblingFiles.includes("project.json")
  ) {
    return {};
  }

  const vercelBuildTarget: TargetConfiguration = {
    // command: `vercel build --yes`,
    // options: { cwd: context.workspaceRoot },
    executor: "@j5/vercel:build",
    parallelism: false,
    cache: false,
    inputs: ["{projectRoot}/**"],
    outputs: [`{workspaceRoot}/.vercel`],
    dependsOn: ["convex-deploy", "^build"],
  };

  // Inferred task final output
  const vercelDeployTarget: TargetConfiguration = {
    // options: { cwd: context.workspaceRoot },
    executor: "@j5/vercel:deploy",
    parallelism: false,
    cache: true,
    inputs: ["{projectRoot}/**"],
    outputs: [`{projectRoot}/.vercel-url`],
    dependsOn: ["vercel-build"],
  };

  // Project configuration to be merged into the rest of the Nx configuration
  return {
    projects: {
      [projectRoot]: {
        targets: {
          "vercel-build": vercelBuildTarget,
          "vercel-deploy": vercelDeployTarget,
        },
      },
    },
  };
}
