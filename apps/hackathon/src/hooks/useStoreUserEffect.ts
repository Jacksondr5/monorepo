import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { zodCreateUser, zodUserId } from "../server/zod/user";

export function useStoreUserEffect() {
  const { user, isSignedIn } = useUser();
  const [userId, setUserId] = useState<zodUserId | null>(null);
  const storeUser = useMutation(api.users.upsertUser);

  useEffect(() => {
    // If the user is not logged in don't do anything
    if (!isSignedIn || !user) {
      // TODO: redirect to auth
      return;
    }
    const userData = {
      clerkUserId: user.id,
      firstName: user.firstName!,
      lastName: user.lastName!,
      avatarUrl: user.imageUrl,
      role: "USER",
    } satisfies zodCreateUser;
    // Store the user in the database.
    // Recall that `storeUser` gets the user information via the `auth`
    // object on the server. You don't need to pass anything manually here.
    async function createUser() {
      try {
        const id = await storeUser({
          user: userData,
        });
        setUserId(id);
      } catch (error) {
        console.error("Failed to store user:", error);
        // TODO: add toast
      }
    }
    createUser();
    return () => setUserId(null);
  }, [isSignedIn, storeUser, user?.id]);

  return {
    isLoading: !isSignedIn || (isSignedIn && userId === null),
    isAuthenticated: isSignedIn && userId !== null,
  };
}
