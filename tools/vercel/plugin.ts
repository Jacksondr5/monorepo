import {
  createNodesFromFiles,
  CreateNodesContextV2,
  TargetConfiguration,
  CreateNodesV2,
} from "@nx/devkit";
import { readdirSync } from "fs";
import { basename, dirname, join } from "path";

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
  const project = basename(projectRoot);

  // Do not create a project if package.json or project.json isn't there.
  const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));
  if (
    !siblingFiles.includes("package.json") &&
    !siblingFiles.includes("project.json")
  ) {
    return {};
  }

  const vercelBuildDeployTarget: TargetConfiguration = {
    // Cannot be cached because cache will trigger on a new branch, which
    // should get a new preview environment and thus be re-run.
    cache: false,
    dependsOn: ["convex-deploy", "^build"],
    executor: "@j5/vercel:build-deploy",
    inputs: ["default", "^production", "vercelPlugin"],
    outputs: [`{workspaceRoot}/vercel-urls/${project}.vercel-url`],
    parallelism: false,
  };

  // Project configuration to be merged into the rest of the Nx configuration
  return {
    projects: {
      [projectRoot]: {
        targets: {
          "vercel-build-deploy": vercelBuildDeployTarget,
        },
      },
    },
  };
}
