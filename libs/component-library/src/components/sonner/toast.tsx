import { toast as sonnerToast } from "sonner";
import { cn } from "../../lib/utils";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info as InfoIcon,
  Bell,
  Loader2,
} from "lucide-react";
import * as React from "react";

export type ToastVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "default"
  | "loading";

export interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  variant?: ToastVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

const variantStyles = {
  default: {
    base: "bg-olive-2 border-olive-6 text-olive-11",
    iconComponent: Bell,
    iconColor: "text-olive-9",
    actionButtonClass:
      "text-olive-11 hover:bg-olive-4 focus-visible:ring-olive-7",
    ringOffsetClass: "ring-offset-olive-2",
  },
  success: {
    base: "bg-green-2 border-green-6 text-green-11",
    iconComponent: CheckCircle2,
    iconColor: "text-green-9",
    actionButtonClass:
      "text-green-11 hover:bg-green-4 focus-visible:ring-green-7",
    ringOffsetClass: "ring-offset-green-2",
  },
  error: {
    base: "bg-red-2 border-red-6 text-red-11",
    iconComponent: XCircle,
    iconColor: "text-red-9",
    actionButtonClass: "text-red-11 hover:bg-red-4 focus-visible:ring-red-7",
    ringOffsetClass: "ring-offset-red-2",
  },
  warning: {
    base: "bg-amber-2 border-amber-6 text-amber-11",
    iconComponent: AlertTriangle,
    iconColor: "text-amber-9",
    actionButtonClass:
      "text-amber-11 hover:bg-amber-4 focus-visible:ring-amber-7",
    ringOffsetClass: "ring-offset-amber-2",
  },
  info: {
    base: "bg-blue-2 border-blue-6 text-blue-11",
    iconComponent: InfoIcon,
    iconColor: "text-blue-9",
    actionButtonClass: "text-blue-11 hover:bg-blue-4 focus-visible:ring-blue-7",
    ringOffsetClass: "ring-offset-blue-2",
  },
  loading: {
    base: "bg-slate-2 border-slate-6 text-slate-11",
    iconComponent: Loader2,
    iconColor: "text-slate-9",
    actionButtonClass: "",
    ringOffsetClass: "ring-offset-slate-2",
  },
};

export function Toast(props: ToastProps) {
  const {
    title,
    description,
    action,
    id,
    variant = "default",
    icon: customIcon,
  } = props;

  const currentVariantStyle = variantStyles[variant] || variantStyles.default;
  const IconComponent = currentVariantStyle.iconComponent;

  const iconElement =
    customIcon !== undefined ? (
      customIcon
    ) : (
      <IconComponent
        className={cn(
          "h-5 w-5",
          currentVariantStyle.iconColor,
          variant === "loading" && "animate-spin",
        )}
        aria-hidden="true"
      />
    );

  return (
    <div
      className={cn(
        "flex w-full items-start rounded-lg border p-4 shadow-lg sm:w-96",
        currentVariantStyle.base,
      )}
      role="alert"
      aria-live="polite"
    >
      {iconElement && <div className="shrink-0 pt-0.5">{iconElement}</div>}
      <div className={cn("ml-3 flex-1", { "ml-0": !iconElement })}>
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="mt-1 text-sm opacity-90">{description}</p>
        )}
      </div>
      {action && (
        <div className="ml-4 flex shrink-0 items-center self-stretch">
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-sm font-medium",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              currentVariantStyle.actionButtonClass,
              currentVariantStyle.ringOffsetClass,
            )}
            onClick={() => {
              action.onClick();
              sonnerToast.dismiss(id);
            }}
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
}
