import DopplerSDK, { SecretsListResponse } from "@dopplerhq/node-sdk";
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
