import { spawnSync } from "child_process";

const cwd = process.cwd();
console.log(`CWD: ${cwd}`);
console.log(`Switching to root of monorepo`);
process.chdir("../../");
console.log(`Current working directory: ${process.cwd()}`);
let exitCode = 1;
try {
  console.log("Parsing arguments...");
  const packageArg = process.argv[2];
  console.log(`Package arg: ${packageArg}`);
  if (!packageArg) {
    console.error(
      "Please provide a package name (e.g. @j5/hire) as an argument for this script.",
    );
    process.exit(1);
  }
  console.log(`Running command: pnpm dlx nx-ignore ${packageArg}`);
  const result = spawnSync("pnpm", ["dlx", "nx-ignore", packageArg], {
    stdio: "inherit",
  });
  console.log(`Command finished with exit code ${result.status}`);
  exitCode = result.status ?? 1;
} catch (error) {
  console.error(error);
  console.log(`Caught error, exiting with code 1`);
  exitCode = 1;
} finally {
  console.log(`Switching back to original CWD: ${cwd}`);
  process.chdir(cwd);
  console.log(`Current working directory: ${process.cwd()}`);
}
console.log("Exiting with code: " + exitCode);
process.exit(exitCode);
