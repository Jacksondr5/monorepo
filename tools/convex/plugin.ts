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
  "**/convex/*.ts",
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
  _: ConvexPluginOptions | undefined,
  context: CreateNodesContextV2,
) {
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
    // command: `convex deploy -v --cmd 'echo $CONVEX_URL > ${projectRoot}/.convex-url'`,
    options: { cwd: projectRoot },
    executor: "@j5/convex:deploy",
    parallelism: false,
    cache: true,
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
