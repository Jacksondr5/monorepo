"use client";

import { LoaderCircle } from "lucide-react";
import { useStoreUserEffect } from "~/hooks/useStoreUserEffect";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@j5/component-library";

export default function SignUp() {
  const { isLoading, userUpsertSucceeded } = useStoreUserEffect();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && userUpsertSucceeded) {
      const timeoutId = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [isLoading, userUpsertSucceeded, router]);
  if (userUpsertSucceeded === false) {
    return (
      <div className="text-slate-12 flex flex-col items-center justify-center gap-8 p-4 md:p-8">
        <div className="flex items-center gap-2 text-3xl" aria-live="polite">
          Failed to create your account. Please try again.
        </div>
        <Button
          onClick={() => window.location.reload()}
          dataTestId="try-again-button"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="text-slate-12 flex flex-col items-center justify-center gap-8 p-4 md:p-8">
      {isLoading ? (
        <div
          className="flex items-center gap-2 text-3xl"
          role="status"
          aria-live="polite"
        >
          Setting up your account{" "}
          <LoaderCircle className="h-8 w-8 animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-3xl" aria-live="polite">
          Setup complete, redirecting to dashboard
          <LoaderCircle className="h-8 w-8 animate-spin" aria-hidden="true" />
          <span className="sr-only">Redirecting...</span>
        </div>
      )}
    </div>
  );
}
