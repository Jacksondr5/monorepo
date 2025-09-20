import { ExecutorContext } from "@nx/devkit";
import { env } from "../../env";
import { Vercel } from "@vercel/sdk";
import { readFile } from "fs/promises";
import {
  getCurrentCommitSha,
  logAndCreateError,
} from "../../../../shared/src/index";
import { createSecretsReader } from "../../../../shared/src/doppler";
import { getProjectRoot, getProjectSlug } from "../../../../shared/src/nx";
import { writeWorkspaceVercelUrl } from "../../../../shared/src/urls";
import { run } from "../../../../shared/src/run";
export interface VercelBuildExecutorOptions {
  hasConvex: boolean;
}

export default async function buildExecutor(
  options: VercelBuildExecutorOptions,
  context: ExecutorContext,
) {
  // Get vercel key from Doppler
  const project = getProjectSlug(context);
  console.info(`Running vercel build for project: ${project}`);
  const projectRoot = getProjectRoot(context);
  console.info(`Project Root: ${projectRoot}`);
  const vercelKeyName = "VERCEL_CLI_TOKEN";
  console.info(`Vercel key name: ${vercelKeyName}`);

  const commitSha = await getCurrentCommitSha(projectRoot);

  const secrets = await createSecretsReader(projectRoot, env.DOPPLER_TOKEN);
  const vercelKey = secrets.get(vercelKeyName);

  // Run link command
  console.info(`Linking project ${project} to Vercel`);
  const linkResult = await run(
    `pnpm vercel link --yes --project ${project} --token ${vercelKey}`,
    {
      cwd: context.root,
      env: {
        ...process.env,
      },
    },
  );
  if (linkResult.code !== 0) {
    throw logAndCreateError("vercel link failed");
  }

  // If hasConvex, get convex URL from .convex-url
  let convexUrl = "";
  if (options.hasConvex) {
    console.info(`Reading convex URL from .convex-url`);
    convexUrl = (await readFile(`${projectRoot}/.convex-url`, "utf8")).trim();
    console.info(`Convex URL: ${convexUrl}`);
  }

  // Run build command
  console.info(`Building project ${project} with Vercel`);
  const buildResult = await run(
    `pnpm vercel build --yes --token ${vercelKey}`,
    {
      cwd: context.root,
      env: {
        ...process.env,
        NEXT_PUBLIC_CONVEX_URL: convexUrl,
      },
    },
  );
  if (buildResult.code !== 0) {
    throw logAndCreateError("vercel build failed");
  }

  // Run deploy command
  console.info(`Project Root: ${projectRoot}`);
  const deployResult = await run(
    `pnpm vercel --prebuilt --archive=tgz --yes --token ${vercelKey}`,
    {
      cwd: context.root,
      env: {
        ...process.env,
      },
    },
  );
  if (deployResult.code !== 0) {
    throw logAndCreateError("vercel deploy failed");
  }

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

  console.info(`Writing deployment URL to vercel-urls for project`);
  writeWorkspaceVercelUrl(context.root, project, deploymentUrl);
  console.info(`Deployment URL written for project ${project}`);
  return { success: true };
}
