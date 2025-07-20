import {
  createNodesFromFiles,
  CreateNodesContextV2,
  TargetConfiguration,
  CreateNodesV2,
} from "@nx/devkit";
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
    cache: true,
    dependsOn: ["convex-deploy", "^build"],
    executor: "@j5/vercel:build",
    inputs: ["default", "^production"],
    outputs: [`{workspaceRoot}/.vercel`],
    parallelism: false,
  };

  // Inferred task final output
  const vercelDeployTarget: TargetConfiguration = {
    cache: true,
    dependsOn: ["vercel-build"],
    executor: "@j5/vercel:deploy",
    inputs: ["default", "^production"],
    outputs: [`{projectRoot}/.vercel-url`],
    parallelism: false,
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
