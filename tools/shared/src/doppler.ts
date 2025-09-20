import DopplerSDK, { SecretsListResponse } from "@dopplerhq/node-sdk";
export interface SchemaParser<T> {
  parse: (input: unknown) => T;
}
import { getCurrentBranch } from "./gitUtils";
import { logAndCreateError } from "./logAndCreateError";

type SecretGroup = Required<SecretsListResponse>["secrets"];
type Secret = Required<SecretGroup["USER"]>;

// TODO: add type validation for the secrets
export const getDopplerSecrets = async (
  baseDir: string,
  dopplerToken: string,
) => {
  const branch = await getCurrentBranch(baseDir);
  const dopplerProject = branch === "main" ? "prd" : "stg";
  const doppler = new DopplerSDK({ accessToken: dopplerToken });
  const result = await doppler.secrets.list("ci", dopplerProject);
  const secrets = result.secrets as Record<string, Secret> | undefined;
  if (!secrets) {
    throw logAndCreateError("No secrets found");
  }
  return secrets;
};

export function buildProjectScopedKey(
  appProject: string,
  suffix: string,
): string {
  return `${appProject.toUpperCase().replace(/-/g, "_")}_${suffix}`;
}

export function parseJsonSecretOrThrow(
  name: string,
  raw?: string,
): Record<string, unknown> {
  if (!raw)
    throw logAndCreateError(`Required Doppler secret not found: ${name}`);
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (e) {
    throw logAndCreateError(`Failed to parse JSON for ${name}: ${e}`);
  }
}

export interface SecretsReader {
  get(keyName: string): string;
  getJson<T>(keyName: string, schema: SchemaParser<T>): T;
}

export async function createSecretsReader(
  baseDir: string,
  dopplerToken: string,
): Promise<SecretsReader> {
  const all = await getDopplerSecrets(baseDir, dopplerToken);
  return {
    get(keyName: string): string {
      const v = all[keyName]?.computed;
      if (!v)
        throw logAndCreateError(
          `Required Doppler secret not found: ${keyName}`,
        );
      return v;
    },
    getJson<T>(keyName: string, schema: SchemaParser<T>): T {
      const raw = all[keyName]?.computed;
      const obj = parseJsonSecretOrThrow(keyName, raw);
      try {
        return schema.parse(obj);
      } catch (e) {
        throw logAndCreateError(`Invalid JSON for ${keyName}: ${String(e)}`);
      }
    },
  };
}
