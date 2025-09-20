import { ExecutorContext } from "@nx/devkit";
import {
  logAndCreateError,
  getDopplerSecrets,
  getCurrentBranch,
} from "../../../../shared/src/index";
import { env } from "../../env";
import { promisify } from "util";
import { exec } from "child_process";
import { readFile } from "fs/promises";

export default async function deployExecutor(
  _: unknown,
  context: ExecutorContext,
) {
  // Get convex deploy key from Doppler
  const project = context.projectName?.split("/")[1];
  if (!project) {
    throw logAndCreateError(
      `Invalid project name format: ${context.projectName}`,
    );
  }
  console.info(`Running convex deploy for project: ${project}`);
  const projectRoot = `${context.root}/apps/${project}`;
  const convexDeployKeyName = `CONVEX_DEPLOY_KEY_${project?.toUpperCase()}`;
  console.info(`Convex deploy key name: ${convexDeployKeyName}`);

  const secrets = await getDopplerSecrets(projectRoot, env.DOPPLER_TOKEN);
  const convexDeployKey = secrets[convexDeployKeyName]?.computed;
  if (!convexDeployKey) {
    throw logAndCreateError(
      `Convex deploy key not found: ${convexDeployKeyName}`,
    );
  }

  // Run deploy command
  const branch = await getCurrentBranch(projectRoot);
  const previewCreate = branch === "main" ? "" : `--preview-create "${branch}"`;
  console.info(`Project Root: ${projectRoot}`);
  const { stdout, stderr } = await promisify(exec)(
    `pnpm convex deploy -v --cmd-url-env-var-name CONVEX_URL --cmd 'echo $CONVEX_URL > .convex-url' ${previewCreate}`,
    {
      cwd: projectRoot,
      env: {
        ...process.env,
        CONVEX_DEPLOY_KEY: convexDeployKey,
      },
    },
  );
  console.log(stdout);
  console.error(stderr);

  // Get the convex url from the .convex-url file
  try {
    const convexUrl = await readFile(`${projectRoot}/.convex-url`, "utf8");
    console.info(`Convex URL: ${convexUrl}`);
  } catch (error) {
    throw logAndCreateError(`Failed to get convex url: ${error}`);
  }

  return { success: true };
}
