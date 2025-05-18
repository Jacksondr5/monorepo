import { spawnSync } from "child_process";

const cwd = process.cwd();
process.chdir("../../");
try {
  const packageArg = process.argv[2];
  if (!packageArg) {
    console.error(
      "Please provide a package name (e.g. @j5/hire) as an argument for this script.",
    );
    process.exit(1);
  }
  spawnSync("pnpm", ["dlx", "nx-ignore", packageArg], { stdio: "inherit" });
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  process.chdir(cwd);
}
