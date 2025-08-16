import { ExecutorContext } from "@nx/devkit";
import { logAndCreateError } from "../../utils";
import DopplerSDK, { type SecretsListResponse } from "@dopplerhq/node-sdk";
import { env } from "../../env";
import { promisify } from "util";
import { exec } from "child_process";
import simpleGit from "simple-git";
import fs from "fs/promises";

type SecretGroup = Required<SecretsListResponse>["secrets"];
type Secret = Required<SecretGroup["USER"]>;

const doppler = new DopplerSDK({ accessToken: env.DOPPLER_TOKEN });

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

  const git = simpleGit(projectRoot);
  let branch: string;
  try {
    branch = await git.revparse(["--abbrev-ref", "HEAD"]);
    console.info(`Current branch: ${branch}`);
  } catch (error) {
    throw logAndCreateError(`Failed to get current branch: ${error}`);
  }

  const dopplerProject = branch === "main" ? "prd" : "stg";
  console.info(`Doppler project: ${dopplerProject}`);

  const result = await doppler.secrets.list("ci", dopplerProject);
  const secrets = result.secrets as Record<string, Secret> | undefined;
  if (!secrets) {
    throw logAndCreateError("No secrets found");
  }
  const convexDeployKey = secrets[convexDeployKeyName]?.computed;
  if (!convexDeployKey) {
    throw logAndCreateError(
      `Convex deploy key not found: ${convexDeployKeyName}`,
    );
  }

  // Run deploy command
  const previewCreate = branch === "main" ? "" : `--preview-create "${branch}"`;
  console.info(`Project Root: ${projectRoot}`);
  const { stdout, stderr } = await promisify(exec)(
    `pnpm dlx convex deploy -v --cmd-url-env-var-name CONVEX_URL --cmd 'echo $CONVEX_URL > .convex-url' ${previewCreate}`,
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
    const convexUrl = await fs.readFile(`${projectRoot}/.convex-url`, "utf8");
    console.info(`Convex URL: ${convexUrl}`);
  } catch (error) {
    throw logAndCreateError(`Failed to get convex url: ${error}`);
  }

  return { success: true };
}
