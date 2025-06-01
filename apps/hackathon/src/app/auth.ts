import { auth } from "@clerk/nextjs/server";

export async function getAuthToken() {
  // TODO: fix
  // This throwing could cause massive problems
  // Probably want to handle this better
  // Though, making this nullable may also have issues
  return (await (await auth()).getToken({ template: "convex" })) ?? undefined;
}
