import { SecretsReader } from "./doppler";
import { logAndCreateError } from "./logAndCreateError";

export interface CheckInOptions {
  agentId: string;
  gitSha: string;
  project: string;
  secrets: SecretsReader;
  task: string;
}

export interface CheckInResult {
  message?: string;
  shouldProceed: boolean;
}

interface ClaimResponse {
  message?: string;
  proceed: boolean;
}

const RETRY_DELAYS_MS = [1000, 2000, 4000];

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const FETCH_TIMEOUT_MS = 10000;

const isNetworkError = (error: unknown): boolean => {
  if (error instanceof TypeError) {
    return true;
  }
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return true;
    }
    const message = error.message.toLowerCase();
    return (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("econnrefused") ||
      message.includes("enotfound") ||
      message.includes("timeout")
    );
  }
  return false;
};

export const checkInAndProceed = async (
  options: CheckInOptions,
): Promise<CheckInResult> => {
  const { agentId, gitSha, project, secrets, task } = options;
  const coordinatorUrl = secrets.get("NX_COORDINATOR_URL");
  const taskKey = `${project}:${task}`;
  const url = `${coordinatorUrl}/api/claim`;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      console.log(`Checking in with coordinator at ${url}`);
      const response = await fetch(url, {
        body: JSON.stringify({ agentId, gitSha, project, task }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Coordinator returned ${response.status}: ${errorText}`,
        );
      }

      const data = (await response.json()) as ClaimResponse;

      if (data.proceed) {
        console.info(`Task ${taskKey} - proceeding as first instance`);
        return { shouldProceed: true };
      } else {
        const message = data.message ?? `Task already claimed by another agent`;
        console.info(`Task ${taskKey} - skipping, ${message}`);
        return { message, shouldProceed: false };
      }
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error instanceof Error ? error : new Error(String(error));

      if (isNetworkError(error) && attempt < RETRY_DELAYS_MS.length) {
        const delay = RETRY_DELAYS_MS[attempt];
        console.warn(
          `Task ${taskKey} - coordinator request failed (attempt ${attempt + 1}/${RETRY_DELAYS_MS.length + 1}), retrying in ${delay}ms: ${lastError.message}`,
        );
        await sleep(delay);
        continue;
      }

      throw logAndCreateError(
        `Task ${taskKey} - coordinator request failed after ${attempt + 1} attempts: ${lastError.message}`,
      );
    }
  }
};
