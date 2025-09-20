import { ExecutorContext } from "@nx/devkit";
import { env } from "../../env";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { spawn } from "node:child_process";
import {
  logAndCreateError,
  getDopplerSecrets,
} from "../../../../shared/src/index";

export function run(
  cmd: string,
  opts: { cwd?: string; env?: NodeJS.ProcessEnv } = {},
): Promise<{ code: number | null }> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, {
      stdio: "inherit",
      shell: true,
      cwd: opts.cwd,
      env: opts.env,
    });

    child.once("error", reject);
    child.once("exit", (code) => {
      resolve({ code });
    });
  });
}

export interface E2eCiExecutorOptions {
  command?: string;
  cwd?: string;
  env?: Record<string, string>;
}

export default async function e2eCiExecutor(
  options: E2eCiExecutorOptions,
  context: ExecutorContext,
) {
  const e2eTestProject = context.projectName?.split("/")[1];
  if (!e2eTestProject) {
    console.error(`Invalid project name format: ${context.projectName}`);
    return { success: false };
  }
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
  const vercelUrlPath = join(cwd, ".vercel-url");
  if (existsSync(vercelUrlPath)) {
    try {
      console.info(`Reading BASE_URL from .vercel-url: ${vercelUrlPath}`);
      process.env.BASE_URL = readFileSync(vercelUrlPath, "utf8").trim();
      console.info(`BASE_URL: ${process.env.BASE_URL}`);
    } catch (e) {
      throw logAndCreateError(`Failed to read .vercel-url: ${e}`);
    }
  }

  const secrets = await getDopplerSecrets(cwd, env.DOPPLER_TOKEN);
  const keyName = `${appProject.toUpperCase().replace("-", "_")}_E2E_SECRETS`;
  const raw = secrets[keyName]?.computed;
  if (!raw) {
    throw logAndCreateError(`Required Doppler secret not found: ${keyName}`);
  }
  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(raw) as Record<string, string>;
  } catch (e) {
    throw logAndCreateError(`Failed to parse JSON for ${keyName}: ${e}`);
  }
  Object.assign(process.env, parsed);

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
