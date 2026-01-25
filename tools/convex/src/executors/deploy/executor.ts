import { ExecutorContext } from "@nx/devkit";
import * as os from "os";
import { env } from "../../env";
import {
  buildProjectScopedKey,
  checkInAndProceed,
  createSecretsReader,
  getCurrentBranch,
  getCurrentCommitSha,
  getProjectRoot,
  getProjectSlug,
  logAndCreateError,
  readConvexUrl,
  run,
} from "../../../../shared/src/index";

export default async function deployExecutor(
  _: unknown,
  context: ExecutorContext,
) {
  // Get convex deploy key from Doppler
  const project = getProjectSlug(context);
  console.info(`Running convex deploy for project: ${project}`);
  const projectRoot = getProjectRoot(context);
  const convexDeployKeyName = buildProjectScopedKey(
    project,
    "CONVEX_DEPLOY_KEY",
  );
  console.info(`Convex deploy key name: ${convexDeployKeyName}`);

  const secrets = await createSecretsReader(projectRoot, env.DOPPLER_TOKEN);
  const convexDeployKey = secrets.get(convexDeployKeyName);

  // Check in with coordinator to prevent duplicate deployments
  const gitSha = await getCurrentCommitSha(projectRoot);
  const agentId =
    process.env.NX_CLOUD_AGENT_ID || `${os.hostname()}-${process.pid}`;
  console.info(`Agent ID: ${agentId}, Git SHA: ${gitSha}`);

  const { shouldProceed, message } = await checkInAndProceed({
    agentId,
    gitSha,
    project,
    secrets,
    task: "convex-deploy",
  });

  if (!shouldProceed) {
    console.info(message || "Task already claimed by another agent");
    return { success: true };
  }

  // Run deploy command with retry logic
  const branch = await getCurrentBranch(projectRoot);
  const previewCreate = branch === "main" ? "" : `--preview-create "${branch}"`;
  console.info(`Project Root: ${projectRoot}`);

  const maxRetries = 5;
  let result;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.info(`Convex deploy attempt ${attempt}/${maxRetries}`);
    result = await run(
      `pnpm convex deploy -v --cmd-url-env-var-name CONVEX_URL --cmd 'echo $CONVEX_URL > .convex-url' ${previewCreate}`,
      {
        cwd: projectRoot,
        env: {
          ...process.env,
          CONVEX_DEPLOY_KEY: convexDeployKey,
        },
      },
    );
    if (result.code === 0) {
      break;
    }
    if (attempt < maxRetries) {
      console.warn(
        `Convex deploy attempt ${attempt} failed, retrying in 10 seconds...`,
      );
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }

  if (!result || result.code !== 0) {
    throw logAndCreateError(
      `convex deploy failed after ${maxRetries} attempts`,
    );
  }

  // Get the convex url from the .convex-url file
  const convexUrl = readConvexUrl(projectRoot);
  console.info(`Convex URL: ${convexUrl}`);
  if (!convexUrl) {
    throw logAndCreateError("Failed to get convex url");
  }

  return { success: true };
}
