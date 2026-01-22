import { ExecutorContext } from "@nx/devkit";
import * as os from "os";
import { Vercel } from "@vercel/sdk";
import { env } from "../../env";
import {
  checkInAndProceed,
  createSecretsReader,
  getCurrentCommitSha,
  getProjectRoot,
  getProjectSlug,
  logAndCreateError,
  readConvexUrl,
  run,
  writeWorkspaceVercelUrl,
} from "../../../../shared/src/index";
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

  // Check in with coordinator to prevent duplicate deployments
  const agentId =
    process.env.NX_CLOUD_AGENT_ID || `${os.hostname()}-${process.pid}`;
  console.info(`Agent ID: ${agentId}, Git SHA: ${commitSha}`);

  const { shouldProceed, message } = await checkInAndProceed({
    agentId,
    gitSha: commitSha,
    project,
    secrets,
    task: "vercel-build-deploy",
  });

  if (!shouldProceed) {
    console.info(message || "Task already claimed by another agent");
    return { success: true };
  }

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
  console.info(`Linked project ${project} to Vercel`);

  // If hasConvex, get convex URL from .convex-url
  const convexUrl = options.hasConvex ? readConvexUrl(projectRoot) : null;

  // Run build command
  console.info(`Building project ${project} with Vercel`);
  const buildResult = await run(
    `pnpm vercel build --yes --token ${vercelKey}`,
    {
      cwd: context.root,
      env: {
        ...process.env,
        ...(convexUrl ? { NEXT_PUBLIC_CONVEX_URL: convexUrl } : {}),
      },
    },
  );
  if (buildResult.code !== 0) {
    throw logAndCreateError("vercel build failed");
  }

  // Run deploy command
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

  const deployment = recentDeployments[0];
  console.info(`Deployment: ${JSON.stringify(deployment)}`);
  const deploymentUrl = deployment.url;
  console.info(`Deployment URL: ${deploymentUrl}`);

  console.info(`Writing deployment URL to vercel-urls for project`);
  writeWorkspaceVercelUrl(context.root, project, deploymentUrl);
  console.info(`Deployment URL written for project ${project}`);
  return { success: true };
}
