import {
  createNodesFromFiles,
  CreateNodesContextV2,
  CreateNodesV2,
} from "@nx/devkit";
import { createNodesV2 as playwrightCreateNodesV2 } from "@nx/playwright/plugin";

// We leverage the @nx/playwright/plugin's createNodesV2 and then rewrite the
// atomized e2e-ci tasks to target our custom executor.
export interface PlaywrightEnvPluginOptions {
  projectName?: string;
}

export const createNodesV2: CreateNodesV2<PlaywrightEnvPluginOptions> = [
  "**/playwright.config.ts",
  async (configFiles, options, context) => {
    return await createNodesFromFiles(
      (configFile, _options, ctx) => createNodesInternal(configFile, ctx),
      configFiles,
      options,
      context,
    );
  },
];

async function createNodesInternal(
  matchingFile: string,
  context: CreateNodesContextV2,
) {
  // Call the official plugin createNodesV2 for this file
  const [, handler] = playwrightCreateNodesV2;
  const baseArray = await handler([matchingFile], undefined, context);
  const resultArray = baseArray.map(([_, result]) => result);
  // This is an assumption that there is only 1 Playwright config file
  const base = resultArray[0];
  if (!base?.projects) return base ?? {};

  // Rewrite atomized e2e-ci tasks to our executor and pass original command
  for (const [projectName, projectConfig] of Object.entries(base.projects)) {
    const targets = projectConfig.targets ?? {};
    base.projects[projectName].targets!["e2e-ui-host"] = {
      command: "playwright test --ui --ui-host 0.0.0.0",
      options: {
        cwd: `${context.workspaceRoot}/${projectName}`,
      },
    };
    for (const [targetName, target] of Object.entries(targets)) {
      if (!targetName.startsWith("e2e-ci--")) continue;
      const options = target.options ?? {};
      const command = target.command ?? "no command";

      // Swap executor to our custom one and preserve other target props
      base.projects[projectName].targets![targetName] = {
        ...target,
        executor: "@j5/playwright-env:e2e-ci",
        command: undefined,
        options: {
          ...options,
          command,
        },
      };
    }
  }

  return base;
}
