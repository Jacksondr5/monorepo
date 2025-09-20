import { ExecutorContext } from "@nx/devkit";
import { env } from "../../env";
import { promisify } from "util";
import { exec } from "child_process";
import { Vercel } from "@vercel/sdk";
import { writeFile } from "fs/promises";
import { readFile } from "fs/promises";
import {
  getDopplerSecrets,
  getCurrentCommitSha,
  logAndCreateError,
} from "@j5/shared-tools";
export interface VercelBuildExecutorOptions {
  hasConvex: boolean;
}

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

  const commitSha = await getCurrentCommitSha(projectRoot);

  const secrets = await getDopplerSecrets(projectRoot, env.DOPPLER_TOKEN);
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
  // TODO: uncomment before merging
  // if (recentDeployments.length > 1) {
  //   throw logAndCreateError("Multiple deployments found");
  // }
  const deployment = recentDeployments[0];
  console.info(`Deployment: ${JSON.stringify(deployment)}`);
  const deploymentUrl = deployment.url;
  console.info(`Deployment URL: ${deploymentUrl}`);

  const vercelUrlPath = `${context.root}/vercel-urls/${project}.vercel-url`;
  console.info(`Writing deployment URL to ${vercelUrlPath} for project`);
  try {
    await writeFile(vercelUrlPath, deploymentUrl);
  } catch (error) {
    throw logAndCreateError(`Failed to write .vercel-url file: ${error}`);
  }
  console.info(`Deployment URL written to ${vercelUrlPath} for project`);
  return { success: true };
}
