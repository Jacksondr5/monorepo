"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching || isMutating;

  if (!isLoading) return null;

  return (
    <div className="text-olive-11 fixed left-4 top-4">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
};
