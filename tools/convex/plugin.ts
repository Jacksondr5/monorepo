import {
  createNodesFromFiles,
  CreateNodesContextV2,
  TargetConfiguration,
  CreateNodesV2,
} from "@nx/devkit";
import { readdirSync } from "fs";
import { dirname, join } from "path";

export interface ConvexPluginOptions {
  projectName: string;
}

export const createNodesV2: CreateNodesV2<ConvexPluginOptions> = [
  "**/convex/schema.ts",
  async (configFiles, options, context) => {
    console.log(`Creating convex nodes for ${configFiles}`);
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
  _: ConvexPluginOptions | undefined,
  context: CreateNodesContextV2,
) {
  console.log(`Creating convex nodes 2 for ${matchingFile}`);
  const convexDir = dirname(matchingFile);
  const projectRoot = dirname(convexDir);

  // Do not create a project if package.json or project.json isn't there.
  const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));
  if (
    !siblingFiles.includes("package.json") &&
    !siblingFiles.includes("project.json")
  ) {
    return {};
  }
  // Inferred task final output
  const convexDeployTarget: TargetConfiguration = {
    options: { cwd: projectRoot },
    executor: "@j5/convex:deploy",
    parallelism: false,
    // Cannot be cached because cache will trigger on a new branch, which
    // should get a new preview environment and thus be re-run.
    cache: false,
    inputs: ["{projectRoot}/convex/**"],
    outputs: [`{projectRoot}/.convex-url`],
  };

  // Project configuration to be merged into the rest of the Nx configuration
  return {
    projects: {
      [projectRoot]: {
        targets: {
          "convex-deploy": convexDeployTarget,
        },
      },
    },
  };
}
