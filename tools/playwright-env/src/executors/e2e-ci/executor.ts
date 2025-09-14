import { ExecutorContext } from "@nx/devkit";
import DopplerSDK, { type SecretsListResponse } from "@dopplerhq/node-sdk";
import { env } from "../../env";
import { promisify } from "util";
import { exec } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { logAndCreateError } from "../../utils";

export interface E2eCiExecutorOptions {
  command?: string;
  cwd?: string;
  env?: Record<string, string>;
}

type SecretGroup = Required<SecretsListResponse>["secrets"];
type Secret = Required<SecretGroup["USER"]>;

const doppler = new DopplerSDK({ accessToken: env.DOPPLER_TOKEN });

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

  // Doppler: select config based on branch
  console.info(`Reading branch from git`);
  const { stdout: branchStdout } = await promisify(exec)(
    "git rev-parse --abbrev-ref HEAD",
    { cwd },
  );
  console.info(`Branch: ${branchStdout}`);
  const branch = branchStdout.trim();
  if (!branch) {
    throw logAndCreateError("Failed to resolve current git branch");
  }
  const dopplerProject = branch === "main" ? "prd" : "stg";
  console.info(`Doppler project: ${dopplerProject}`);

  const keyName = `${appProject.toUpperCase()}_E2E_SECRETS`;
  console.info(`Reading Doppler secrets for key: ${keyName}`);
  const result = await doppler.secrets.list("ci", dopplerProject);
  const secrets = result.secrets as Record<string, Secret> | undefined;
  if (!secrets) {
    throw logAndCreateError("No secrets returned from Doppler");
  }
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
  console.info(`Base command: ${baseCommand}`);
  if (!baseCommand.startsWith("pnpm ")) {
    baseCommand = `pnpm ${baseCommand}`;
  }
  const withReporter = baseCommand.includes("--reporter")
    ? baseCommand
    : `${baseCommand} --reporter=html`;
  console.info(`With reporter: ${withReporter}`);
  const { stdout, stderr } = await promisify(exec)(withReporter, {
    cwd,
    env: {
      ...process.env,
      ...options.env,
    },
  });
  console.log(stdout);
  console.error(stderr);
  return { success: true };
}
