import { PostHog } from "posthog-node";
import { env } from "~/env";

let posthogClient: PostHog | null = null;
export default function PostHogClient() {
  if (!posthogClient) {
    posthogClient = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: env.NEXT_PUBLIC_POSTHOG_HOST,
    });
  }
  return posthogClient;
}
