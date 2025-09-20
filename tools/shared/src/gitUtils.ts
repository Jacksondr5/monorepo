import simpleGit from "simple-git";
import { logAndCreateError } from "./logAndCreateError";

export const getCurrentBranch = async (baseDir: string) => {
  const git = simpleGit(baseDir);
  let branch: string;
  try {
    branch = await git.revparse(["--abbrev-ref", "HEAD"]);
    console.info(`Current branch: ${branch}`);
    return branch;
  } catch (error) {
    throw logAndCreateError(`Failed to get current branch: ${error}`);
  }
};

export const getCurrentCommitSha = async (baseDir: string) => {
  const git = simpleGit(baseDir);
  let commitSha: string;
  try {
    commitSha = await git.revparse(["HEAD"]);
    console.info(`Current commit SHA: ${commitSha}`);
    return commitSha;
  } catch (error) {
    throw logAndCreateError(`Failed to get current commit SHA: ${error}`);
  }
};
