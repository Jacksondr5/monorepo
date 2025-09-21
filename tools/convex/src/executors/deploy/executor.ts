import { ExecutorContext } from "@nx/devkit";
import { env } from "../../env";
import {
  getProjectSlug,
  getProjectRoot,
  run,
  createSecretsReader,
  getCurrentBranch,
  readConvexUrl,
  logAndCreateError,
} from "../../../../shared/src/index";

export default async function deployExecutor(
  _: unknown,
  context: ExecutorContext,
) {
  // Get convex deploy key from Doppler
  const project = getProjectSlug(context);
  console.info(`Running convex deploy for project: ${project}`);
  const projectRoot = getProjectRoot(context);
  const convexDeployKeyName = `CONVEX_DEPLOY_KEY_${project.toUpperCase()}`;
  console.info(`Convex deploy key name: ${convexDeployKeyName}`);

  const secrets = await createSecretsReader(projectRoot, env.DOPPLER_TOKEN);
  const convexDeployKey = secrets.get(convexDeployKeyName);

  // Run deploy command
  const branch = await getCurrentBranch(projectRoot);
  const previewCreate = branch === "main" ? "" : `--preview-create "${branch}"`;
  console.info(`Project Root: ${projectRoot}`);
  const result = await run(
    `pnpm convex deploy -v --cmd-url-env-var-name CONVEX_URL --cmd 'echo $CONVEX_URL > .convex-url' ${previewCreate}`,
    {
      cwd: projectRoot,
      env: {
        ...process.env,
        CONVEX_DEPLOY_KEY: convexDeployKey,
      },
    },
  );
  if (result.code !== 0) {
    throw logAndCreateError("convex deploy failed");
  }

  // Get the convex url from the .convex-url file
  const convexUrl = readConvexUrl(projectRoot);
  console.info(`Convex URL: ${convexUrl}`);
  if (!convexUrl) {
    throw logAndCreateError("Failed to get convex url");
  }

  return { success: true };
}
