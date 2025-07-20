import { ExecutorContext } from "@nx/devkit";
import { logAndCreateError } from "../../utils";
import DopplerSDK, { type SecretsListResponse } from "@dopplerhq/node-sdk";
import { env } from "../../env";
import { promisify } from "util";
import { exec } from "child_process";
import simpleGit from "simple-git";

type SecretGroup = Required<SecretsListResponse>["secrets"];
type Secret = Required<SecretGroup["USER"]>;

const doppler = new DopplerSDK({ accessToken: env.DOPPLER_TOKEN });

export default async function deployExecutor(
  _: unknown,
  context: ExecutorContext,
) {
  // Get vercel key from Doppler
  const project = context.projectName?.split("/")[1];
  if (!project) {
    throw logAndCreateError(
      `Invalid project name format: ${context.projectName}`,
    );
  }
  console.info(`Running vercel deploy for project: ${project}`);
  const projectRoot = `${context.root}/apps/${project}`;
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

  // Run deploy command
  console.info(`Project Root: ${projectRoot}`);
  const { stdout, stderr } = await promisify(exec)(
    `pnpm vercel --prebuilt --archive=tgz --yes`,
    {
      cwd: context.root,
      env: {
        ...process.env,
        VERCEL_TOKEN: vercelKey,
      },
    },
  );
  console.log(stdout);
  console.error(stderr);
  return { success: true };
}
