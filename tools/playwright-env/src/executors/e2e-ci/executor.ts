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
}

type SecretGroup = Required<SecretsListResponse>["secrets"];
type Secret = Required<SecretGroup["USER"]>;

const doppler = new DopplerSDK({ accessToken: env.DOPPLER_TOKEN });

export default async function e2eCiExecutor(
  options: E2eCiExecutorOptions,
  context: ExecutorContext,
) {
  const project = context.projectName?.split("/")[1];
  if (!project) {
    console.error(`Invalid project name format: ${context.projectName}`);
    return { success: false };
  }

  const e2eRoot =
    context.projectsConfigurations?.projects?.[context.projectName!]?.root;
  const cwd = options.cwd ?? join(context.root, e2eRoot ?? "");

  // BASE_URL: from .vercel-url if present
  const vercelUrlPath = join(cwd, ".vercel-url");
  if (existsSync(vercelUrlPath)) {
    try {
      process.env.BASE_URL = readFileSync(vercelUrlPath, "utf8").trim();
    } catch (e) {
      throw logAndCreateError(`Failed to read .vercel-url: ${e}`);
    }
  }

  // Doppler: select config based on branch
  const { stdout: branchStdout } = await promisify(exec)(
    "git rev-parse --abbrev-ref HEAD",
    { cwd },
  );
  const branch = branchStdout.trim();
  if (!branch) {
    throw logAndCreateError("Failed to resolve current git branch");
  }
  const dopplerProject = branch === "main" ? "prd" : "stg";

  // Fetch JSON secret: <APP>_E2E_SECRETS
  const keyName = `${project.toUpperCase()}_E2E_SECRETS`;
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
  const baseCommand = options.command ?? "pnpm exec playwright test";
  const withReporter = baseCommand.includes("--reporter")
    ? baseCommand
    : `${baseCommand} --reporter=html`;

  const { stdout, stderr } = await promisify(exec)(withReporter, {
    cwd,
    env: {
      ...process.env,
    },
  });
  console.log(stdout);
  console.error(stderr);
  return { success: true };
}
