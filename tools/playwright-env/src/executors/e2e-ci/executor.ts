import { ExecutorContext } from "@nx/devkit";
import { env } from "../../env";
import { join } from "path";
import { z } from "zod";
import {
  buildProjectScopedKey,
  createSecretsReader,
} from "../../../../shared/src/doppler";
import { getProjectSlug } from "../../../../shared/src/nx";
import { run } from "../../../../shared/src/run";
import { readWorkspaceVercelUrl } from "../../../../shared/src/urls";

export interface E2eCiExecutorOptions {
  command?: string;
  cwd?: string;
  env?: Record<string, string>;
}

export default async function e2eCiExecutor(
  options: E2eCiExecutorOptions,
  context: ExecutorContext,
) {
  const e2eTestProject = getProjectSlug(context);
  const appProject = e2eTestProject.replace("-e2e", "");
  console.info(
    `Running e2e tests for project: ${appProject}, e2e test project: ${e2eTestProject}`,
  );
  console.info(`Options: ${JSON.stringify(options)}`);

  const e2eRoot =
    context.projectsConfigurations?.projects?.[context.projectName!]?.root;
  const cwd = options.cwd ?? join(context.root, e2eRoot ?? "");
  console.info(`Running e2e tests in cwd: ${cwd}`);

  // BASE_URL: from .vercel-url if present
  const maybeUrl = readWorkspaceVercelUrl(context.root, appProject);
  if (maybeUrl) {
    process.env.BASE_URL = maybeUrl;
    console.info(`BASE_URL: ${process.env.BASE_URL}`);
  }

  const keyName = buildProjectScopedKey(appProject, "E2E_SECRETS");
  const E2ESecretsSchema = z.record(z.string());
  const secrets = await createSecretsReader(cwd, env.DOPPLER_TOKEN);
  const e2eSecrets = secrets.getJson(keyName, {
    parse: (input) => E2ESecretsSchema.parse(input),
  });
  Object.assign(process.env, e2eSecrets);

  // Ensure HTML reporter
  let baseCommand = options.command ?? "pnpm playwright test";
  if (!baseCommand.startsWith("pnpm ")) {
    baseCommand = `pnpm ${baseCommand}`;
  }
  console.info(`Base command: ${baseCommand}`);
  const withReporter = baseCommand.includes("--reporter")
    ? baseCommand
    : `${baseCommand} --reporter=html`;
  console.info(`With reporter: ${withReporter}`);
  console.info(`cwd: ${cwd}`);
  const { code } = await run(withReporter, {
    cwd,
    env: {
      ...process.env,
      ...options.env,
    },
  });
  console.info(`Command finished with exit code ${code}`);
  return { success: code === 0 };
}
