"use client";

import React from "react";
import { toast as sonnerToast } from "sonner";
import { ToastProps, Toast } from "./toast";

type ToastPropsWithoutId = Omit<ToastProps, "id">;

export function toast(
  toastData: ToastPropsWithoutId & Partial<Pick<ToastProps, "id">>,
) {
  console.log("toast data", toastData.id);
  return sonnerToast.custom(
    (id) => (
      <Toast
        id={id}
        title={toastData.title}
        description={toastData.description}
        action={toastData.action}
        icon={toastData.icon}
        variant={toastData.variant}
      />
    ),
    toastData,
  );
}

export interface PromiseToastProps {
  pending: Omit<ToastPropsWithoutId, "variant">;
  success: Omit<ToastPropsWithoutId, "variant">;
  error: Omit<ToastPropsWithoutId, "variant">;
}

export function promiseToast(
  toastData: PromiseToastProps,
  promise: Promise<void>,
) {
  const toastId = toast(toastData.pending);
  promise
    .then(() => {
      toast({
        ...toastData.success,
        id: toastId,
        variant: "success",
      });
    })
    .catch((error) => {
      toast({
        ...toastData.error,
        id: toastId,
        variant: "error",
      });
    });
}

export { Toaster } from "sonner";
