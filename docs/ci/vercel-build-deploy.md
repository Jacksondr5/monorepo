### Vercel build & deploy executor

This executor builds and deploys an Nx app to Vercel using the Vercel CLI and Doppler-managed secrets. It is designed to run inside Nx without precompilation and relies on shared helpers in `tools/shared`.

#### Inputs

- Nx context (`ExecutorContext`): used to derive the app slug and workspace paths
- Options:
  - `hasConvex` (boolean): when true, reads `.convex-url` from the app project root and passes it to the build as `NEXT_PUBLIC_CONVEX_URL`

#### Secrets

- Reads `VERCEL_CLI_TOKEN` via `createSecretsReader(projectRoot, env.DOPPLER_TOKEN).get("VERCEL_CLI_TOKEN")`
- Doppler environment is selected by current git branch: `prd` for `main`, otherwise `stg`

#### Steps

1. Determine project slug and project root using shared `nx` helpers (`getProjectSlug`, `getProjectRoot`).
2. Resolve current commit SHA via `getCurrentCommitSha(projectRoot)`.
3. Create a Doppler secrets reader and fetch `VERCEL_CLI_TOKEN`.
4. Link the project:
   - `pnpm vercel link --yes --project <slug> --token <token>` (cwd: workspace root)
5. Optional Convex URL:
   - If `hasConvex`, read `<projectRoot>/.convex-url` and set `NEXT_PUBLIC_CONVEX_URL` for the build step
6. Build preview:
   - `pnpm vercel build --yes --token <token>` (cwd: workspace root)
7. Deploy prebuilt output:
   - `pnpm vercel --prebuilt --archive=tgz --yes --token <token>` (cwd: workspace root)
8. Resolve the deployment URL:
   - Query Vercel API for READY deployments filtered by app slug and commit sha
   - Pick the most recent
9. Persist the URL for E2E consumers:
   - Write to `{workspaceRoot}/vercel-urls/<slug>.vercel-url`

#### Outputs

- Deployment URL persisted at `{workspaceRoot}/vercel-urls/<slug>.vercel-url`
- Executor result: `{ success: true }`

#### Logging and diagnostics

- Logs project slug, project root, and high-level lifecycle steps
- After linking, logs the contents of `.vercel/project.json` for debugging

#### Failure modes

- Missing `VERCEL_CLI_TOKEN`
- `vercel link`, `vercel build`, or `vercel` (deploy) exits non‑zero
- No READY deployments found for the given `app` and `sha`

#### Notes

- Runs TypeScript directly (no prebuild), importing shared code from `tools/shared/src`
- All Vercel CLI commands execute from the workspace root because this is a requirement of the Vercel CLI. As a result, these tasks cannot run in parallel. Nx doesn't differentiate between "running 2 of the same tasks in parallel" and "running any 2 tasks in parallel", so these run in isolation.
