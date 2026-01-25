#!/usr/bin/env npx tsx

/**
 * Script to compare Clerk configuration between Vercel projects and expected config.
 * Uses the @vercel/sdk for proper API access.
 *
 * Usage:
 *   1. Fill in tools/vercel/src/scripts/clerk-config.json with your Clerk projects
 *   2. Run: VERCEL_TOKEN=xxx npx tsx tools/vercel/src/scripts/check-clerk-config.ts
 *
 * Get your Vercel token from: https://vercel.com/account/tokens
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Vercel } from "@vercel/sdk";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ClerkProject {
  apiUrl: string;
  name: string;
  publishableKey: string;
  secretKey: string;
}

interface ClerkConfig {
  clerkProjects: ClerkProject[];
}

function loadClerkConfig(): ClerkConfig {
  const configPath = join(__dirname, "clerk-config.json");
  const content = readFileSync(configPath, "utf-8");
  return JSON.parse(content) as ClerkConfig;
}

interface EnvResult {
  environment: string;
  hasUnknownKeys?: boolean;
  isEncrypted?: boolean;
  matchedClerkProject: string | null;
  publishableKey: string | null;
  secretKey: string | null;
}

interface ProjectResult {
  envResults: EnvResult[];
  project: string;
}

async function main() {
  const vercelToken = process.env.VERCEL_TOKEN;

  if (!vercelToken) {
    console.error("Error: VERCEL_TOKEN environment variable is required");
    console.error("Get your token from: https://vercel.com/account/tokens");
    process.exit(1);
  }

  const vercel = new Vercel({ bearerToken: vercelToken });

  console.log("🔍 Loading Clerk config from clerk-config.json...\n");

  // Load Clerk projects from JSON file
  const clerkConfig = loadClerkConfig();
  const clerkProjects = clerkConfig.clerkProjects.filter(
    (p) => p.name && (p.publishableKey || p.secretKey),
  );

  if (clerkProjects.length === 0) {
    console.error("Error: No valid Clerk projects found in clerk-config.json");
    console.error("Fill in at least one project with name and publishableKey or secretKey");
    process.exit(1);
  }

  console.log("📋 Clerk Projects:");
  for (const cp of clerkProjects) {
    console.log(`   - ${cp.name}`);
    console.log(`     API URL: ${cp.apiUrl || "N/A"}`);
  }
  console.log("");

  console.log("🔍 Fetching Vercel projects using SDK...\n");

  // Fetch all projects
  const projectsResponse = (await vercel.projects.getProjects({
    limit: "100",
  })) as { projects: Array<{ id: string; name: string }> };
  const projects = projectsResponse.projects;

  console.log(`Found ${projects.length} Vercel projects\n`);
  console.log("=".repeat(80));
  console.log("VERCEL PROJECT CLERK CONFIGURATION");
  console.log("=".repeat(80));

  const results: ProjectResult[] = [];

  const VERCEL_ENVIRONMENTS = ["production", "preview", "development"] as const;

  for (const project of projects) {
    try {
      // List env vars to find Clerk-related vars
      const envResponse = (await vercel.projects.filterProjectEnvs({
        idOrName: project.id,
      })) as { envs: Array<{ id: string; key: string; value?: string; target?: string[] }> };

      const envVars = envResponse.envs;

      // Find all Clerk env vars
      const publishableKeyVars = envVars.filter(
        (e) => e.key === "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      );
      const secretKeyVars = envVars.filter((e) => e.key === "CLERK_SECRET_KEY");

      if (publishableKeyVars.length === 0 && secretKeyVars.length === 0) {
        continue; // Skip projects without Clerk
      }

      const envResults: EnvResult[] = [];

      // Process each Vercel environment separately
      for (const vercelEnv of VERCEL_ENVIRONMENTS) {
        // Find env vars that target this environment
        const publishableKeyVar = publishableKeyVars.find(
          (e) => e.target?.includes(vercelEnv),
        );
        const secretKeyVar = secretKeyVars.find(
          (e) => e.target?.includes(vercelEnv),
        );

        if (!publishableKeyVar && !secretKeyVar) {
          continue; // No Clerk config for this environment
        }

        // Try to get decrypted values
        let publishableValue: string | null = null;
        let secretValue: string | null = null;

        if (publishableKeyVar?.id) {
          try {
            const decrypted = (await vercel.projects.getProjectEnv({
              id: publishableKeyVar.id,
              idOrName: project.id,
            })) as { value?: string };
            publishableValue = decrypted.value ?? null;
          } catch {
            // Decryption might fail due to permissions
          }
        }

        if (secretKeyVar?.id) {
          try {
            const decrypted = (await vercel.projects.getProjectEnv({
              id: secretKeyVar.id,
              idOrName: project.id,
            })) as { value?: string };
            secretValue = decrypted.value ?? null;
          } catch {
            // Decryption might fail due to permissions
          }
        }

        const isPublishableDecrypted =
          publishableValue?.startsWith("pk_") ?? false;
        const isSecretDecrypted = secretValue?.startsWith("sk_") ?? false;

        // Find matching Clerk project by comparing actual key values
        let matchedClerkProject: string | null = null;
        if (isPublishableDecrypted && publishableValue) {
          const matched = clerkProjects.find(
            (cp) => cp.publishableKey === publishableValue,
          );
          matchedClerkProject = matched?.name || null;
        }
        // Fall back to secret key match if publishable didn't match
        if (!matchedClerkProject && isSecretDecrypted && secretValue) {
          const matched = clerkProjects.find(
            (cp) => cp.secretKey === secretValue,
          );
          matchedClerkProject = matched?.name || null;
        }

        // Determine display values
        let publishableDisplay: string | null = null;
        if (publishableValue) {
          if (isPublishableDecrypted) {
            publishableDisplay = `${publishableValue.substring(0, 25)}...`;
          } else {
            publishableDisplay = `[ENCRYPTED/UNAVAILABLE]`;
          }
        }

        let secretDisplay: string | null = null;
        if (secretValue) {
          if (isSecretDecrypted) {
            secretDisplay = `${secretValue.substring(0, 20)}...`;
          } else {
            secretDisplay = `[ENCRYPTED/UNAVAILABLE]`;
          }
        }

        // Check if env vars exist but values are not decrypted
        const hasEnvVars = !!publishableKeyVar || !!secretKeyVar;
        const hasDecryptedValues = isPublishableDecrypted || isSecretDecrypted;
        const isEncrypted = hasEnvVars && !hasDecryptedValues;

        // Track if we have decrypted values but no match (unknown)
        const hasUnknownKeys = hasDecryptedValues && !matchedClerkProject;

        envResults.push({
          environment: vercelEnv,
          hasUnknownKeys,
          isEncrypted,
          matchedClerkProject,
          publishableKey:
            publishableDisplay ??
            (publishableKeyVar ? "[SET BUT NOT DECRYPTED]" : "NOT SET"),
          secretKey:
            secretDisplay ??
            (secretKeyVar ? "[SET BUT NOT DECRYPTED]" : "NOT SET"),
        });
      }

      if (envResults.length > 0) {
        results.push({
          envResults,
          project: project.name,
        });
      }
    } catch (error) {
      console.error(`Error fetching env vars for ${project.name}:`, error);
    }
  }

  // Sort results - projects with issues first, then by project name
  results.sort((a, b) => {
    // Check if any env has unknown keys
    const aHasUnknown = a.envResults.some((e) => e.hasUnknownKeys);
    const bHasUnknown = b.envResults.some((e) => e.hasUnknownKeys);
    if (aHasUnknown && !bHasUnknown) return -1;
    if (bHasUnknown && !aHasUnknown) return 1;

    // Check if all envs are encrypted
    const aAllEncrypted = a.envResults.every((e) => e.isEncrypted);
    const bAllEncrypted = b.envResults.every((e) => e.isEncrypted);
    if (aAllEncrypted && !bAllEncrypted) return -1;
    if (bAllEncrypted && !aAllEncrypted) return 1;

    return a.project.localeCompare(b.project);
  });

  // Print results
  for (const result of results) {
    console.log(`\n📦 ${result.project}`);

    for (const envResult of result.envResults) {
      let matchStatus: string;
      if (envResult.isEncrypted) {
        matchStatus = "🔒 ENCRYPTED";
      } else if (envResult.matchedClerkProject) {
        matchStatus = `✅ ${envResult.matchedClerkProject}`;
      } else if (envResult.hasUnknownKeys) {
        matchStatus = "❓ UNKNOWN";
      } else {
        matchStatus = "⚠️ NO MATCH";
      }

      console.log(`   [${envResult.environment}] → ${matchStatus}`);
      console.log(`      Publishable: ${envResult.publishableKey || "NOT SET"}`);
      console.log(`      Secret: ${envResult.secretKey || "NOT SET"}`);

      if (envResult.isEncrypted) {
        console.log(
          `      ⚠️  Values encrypted. Token may lack decrypt permissions.`,
        );
      }
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("SUMMARY");
  console.log("=".repeat(80));

  // Group by Clerk project (with environment info)
  const byClerkProject = new Map<string, Array<{ env: string; project: string }>>();
  const unknownEntries: Array<{ env: string; project: string }> = [];
  const encryptedEntries: Array<{ env: string; project: string }> = [];

  for (const result of results) {
    for (const envResult of result.envResults) {
      const entry = { env: envResult.environment, project: result.project };
      if (envResult.isEncrypted) {
        encryptedEntries.push(entry);
      } else if (envResult.matchedClerkProject) {
        const list = byClerkProject.get(envResult.matchedClerkProject) || [];
        list.push(entry);
        byClerkProject.set(envResult.matchedClerkProject, list);
      } else if (envResult.hasUnknownKeys) {
        unknownEntries.push(entry);
      }
    }
  }

  console.log("\n📊 VERCEL PROJECTS BY CLERK PROJECT:\n");

  for (const cp of clerkProjects) {
    const entries = byClerkProject.get(cp.name) || [];
    console.log(`   ${cp.name} (${entries.length} environments):`);
    if (entries.length > 0) {
      for (const entry of entries) {
        console.log(`     - ${entry.project} [${entry.env}]`);
      }
    } else {
      console.log(`     (none)`);
    }
    console.log("");
  }

  if (unknownEntries.length > 0) {
    console.log(`   ❓ Unknown Clerk Project (${unknownEntries.length} environments):`);
    for (const entry of unknownEntries) {
      console.log(`     - ${entry.project} [${entry.env}]`);
    }
    console.log("");
  }

  if (encryptedEntries.length > 0) {
    console.log(`   🔒 Encrypted (${encryptedEntries.length} environments):`);
    for (const entry of encryptedEntries) {
      console.log(`     - ${entry.project} [${entry.env}]`);
    }
    console.log("\n   To decrypt, create a Vercel token with 'Full Account' scope");
  }
}

main().catch(console.error);
