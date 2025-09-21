import { spawn } from "node:child_process";

export function run(
  cmd: string,
  opts: { cwd?: string; env?: NodeJS.ProcessEnv } = {},
): Promise<{ code: number | null }> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, {
      stdio: "inherit",
      shell: true,
      cwd: opts.cwd,
      env: opts.env,
    });

    child.once("error", reject);
    child.once("exit", (code) => {
      resolve({ code });
    });
  });
}
