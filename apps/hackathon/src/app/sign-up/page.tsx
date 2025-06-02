"use client";

import { LoaderCircle } from "lucide-react";
import { useStoreUserEffect } from "~/hooks/useStoreUserEffect";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignUp() {
  const { isLoading } = useStoreUserEffect();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [isLoading, router]);

  return (
    <div className="text-slate-12 flex flex-col items-center justify-center gap-8 p-4 md:p-8">
      {isLoading ? (
        <div className="flex items-center gap-2 text-3xl">
          Setting up your account{" "}
          <LoaderCircle className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-3xl">
          Setup complete, redirecting to dashboard
          <LoaderCircle className="h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  );
}
