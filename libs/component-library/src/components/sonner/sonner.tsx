"use client";

import React from "react";
import { toast as sonnerToast } from "sonner";
import { ToastProps, Toast } from "./toast";

type ToastPropsWithoutId = Omit<ToastProps, "id">;

export function toast({
  title,
  description,
  action,
  icon,
  variant,
  duration,
  ...toastData
}: ToastPropsWithoutId &
  Partial<Pick<ToastProps, "id">> & { duration?: number }) {
  return sonnerToast.custom(
    (id) => (
      <Toast
        id={id}
        title={title}
        description={description}
        action={action}
        icon={icon}
        variant={variant}
      />
    ),
    {
      ...toastData,
      duration,
    },
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
    .catch(() => {
      toast({
        ...toastData.error,
        id: toastId,
        variant: "error",
      });
    });
}

export { Toaster } from "sonner";
