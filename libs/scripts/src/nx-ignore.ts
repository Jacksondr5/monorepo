import { spawnSync } from "child_process";

const cwd = process.cwd();
process.chdir("../../");
let exitCode = 1;
try {
  const packageArg = process.argv[2];
  if (!packageArg) {
    console.error(
      "Please provide a package name (e.g. @j5/hire) as an argument for this script.",
    );
    process.exit(1);
  }
  const result = spawnSync("pnpm", ["dlx", "nx-ignore", packageArg], {
    stdio: "inherit",
  });
  exitCode = result.status || 1;
} catch (error) {
  console.error(error);
  exitCode = 1;
} finally {
  process.chdir(cwd);
}
process.exit(exitCode);
