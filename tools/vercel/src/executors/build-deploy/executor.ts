import { ExecutorContext } from "@nx/devkit";
import { logAndCreateError } from "../../utils";
import DopplerSDK, { type SecretsListResponse } from "@dopplerhq/node-sdk";
import { env } from "../../env";
import { promisify } from "util";
import { exec } from "child_process";
import simpleGit from "simple-git";
import { Vercel } from "@vercel/sdk";
import { writeFile } from "fs/promises";
import { existsSync } from "fs";
import { readFile } from "fs/promises";

export interface VercelBuildExecutorOptions {
  hasConvex: boolean;
}

type SecretGroup = Required<SecretsListResponse>["secrets"];
type Secret = Required<SecretGroup["USER"]>;

const doppler = new DopplerSDK({ accessToken: env.DOPPLER_TOKEN });

export default async function buildExecutor(
  options: VercelBuildExecutorOptions,
  context: ExecutorContext,
) {
  // Get vercel key from Doppler
  const project = context.projectName?.split("/")[1];
  if (!project) {
    throw logAndCreateError(
      `Invalid project name format: ${context.projectName}`,
    );
  }
  console.info(`Running vercel build for project: ${project}`);
  const projectRoot = `${context.root}/apps/${project}`;
  console.info(`Project Root: ${projectRoot}`);
  const vercelKeyName = "VERCEL_CLI_TOKEN";
  console.info(`Vercel key name: ${vercelKeyName}`);

  const git = simpleGit(projectRoot);
  let branch: string;
  try {
    branch = await git.revparse(["--abbrev-ref", "HEAD"]);
    console.info(`Current branch: ${branch}`);
  } catch (error) {
    throw logAndCreateError(`Failed to get current branch: ${error}`);
  }
  let commitSha: string;
  try {
    commitSha = await git.revparse(["HEAD"]);
    console.info(`Current commit SHA: ${commitSha}`);
  } catch (error) {
    throw logAndCreateError(`Failed to get current commit SHA: ${error}`);
  }

  const dopplerProject = branch === "main" ? "prd" : "stg";
  console.info(`Doppler project: ${dopplerProject}`);

  const result = await doppler.secrets.list("ci", dopplerProject);
  const secrets = result.secrets as Record<string, Secret> | undefined;
  if (!secrets) {
    throw logAndCreateError("No secrets found");
  }
  const vercelKey = secrets[vercelKeyName]?.computed;
  if (!vercelKey) {
    throw logAndCreateError(`Vercel key not found: ${vercelKeyName}`);
  }

  // Run link command
  console.info(`Linking project ${project} to Vercel`);
  const { stdout: linkStdout, stderr: linkStderr } = await promisify(exec)(
    `pnpm vercel link --yes --project ${project} --token ${vercelKey}`,
    {
      cwd: context.root,
      env: {
        ...process.env,
      },
    },
  );
  console.log(linkStdout);
  console.error(linkStderr);

  // If hasConvex, get convex URL from .convex-url
  let convexUrl = "";
  if (options.hasConvex) {
    console.info(`Reading convex URL from .convex-url`);
    convexUrl = (await readFile(`${projectRoot}/.convex-url`, "utf8")).trim();
    console.info(`Convex URL: ${convexUrl}`);
  }

  // Run build command
  console.info(`Building project ${project} with Vercel`);
  const { stdout: buildStdout, stderr: buildStderr } = await promisify(exec)(
    `pnpm vercel build --yes --token ${vercelKey}`,
    {
      cwd: context.root,
      env: {
        ...process.env,
        NEXT_PUBLIC_CONVEX_URL: convexUrl,
      },
    },
  );
  console.log(buildStdout);
  console.error(buildStderr);

  // Run deploy command
  console.info(`Project Root: ${projectRoot}`);
  const { stdout, stderr } = await promisify(exec)(
    `pnpm vercel --prebuilt --archive=tgz --yes --token ${vercelKey}`,
    {
      cwd: context.root,
      env: {
        ...process.env,
      },
    },
  );
  console.log(stdout);
  console.error(stderr);

  console.info("Deployed successfully");

  const vercel = new Vercel({ bearerToken: vercelKey });
  console.info(`Getting deployments for project: ${project}`);
  const recentDeployments = (
    await vercel.deployments.getDeployments({
      app: project,
      sha: commitSha,
      state: "READY",
    })
  ).deployments.sort((a, b) => b.created - a.created);
  console.info(`Recent deployments: ${JSON.stringify(recentDeployments)}`);
  if (recentDeployments.length === 0) {
    throw logAndCreateError("No deployments found");
  }
  // if (recentDeployments.length > 1) {
  //   throw logAndCreateError("Multiple deployments found");
  // }
  const deployment = recentDeployments[0];
  console.info(`Deployment: ${JSON.stringify(deployment)}`);
  const deploymentUrl = deployment.url;
  console.info(`Deployment URL: ${deploymentUrl}`);

  // Check to see if an e2e project exists
  const e2eProject = `${project}-e2e`;
  const e2eProjectRoot = `${projectRoot}-e2e`;
  const e2eProjectExists = existsSync(e2eProjectRoot);
  if (!e2eProjectExists) {
    console.info(`E2E project does not exist: ${e2eProject}`);
    return { success: true };
  }
  console.info(`Writing deployment URL to .vercel-url for e2e project`);
  await writeFile(`${e2eProjectRoot}/.vercel-url`, deploymentUrl);
  console.info(`Deployment URL written to .vercel-url for e2e project`);
  return { success: true };
}
