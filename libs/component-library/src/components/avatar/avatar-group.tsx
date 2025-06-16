import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip/tooltip";

export type AvatarDataItem = {
  name: string;
  fallback: string;
  className?: string;
} & (
  | {
      src?: undefined;
      alt?: string;
    }
  | {
      src: string;
      alt: string;
    }
);

export const avatarGroupVariants = {
  variant: {
    stacked: "-space-x-2", // Applies negative margin to stack avatars
    default: "space-x-2", // Applies positive margin for default layout
  },
};

export const avatarGroupClassName = cva("flex items-center", {
  variants: avatarGroupVariants,
  defaultVariants: {
    variant: "default",
  },
});

export interface AvatarGroupProps
  extends Omit<React.ComponentProps<"div">, "children">, // Omit children as it's handled internally
    VariantProps<typeof avatarGroupClassName> {
  avatars: AvatarDataItem[];
  max?: number;
  // Custom class for the overflow indicator avatar
  overflowIndicatorClassName?: string;
  // Test ID for the avatar group and prefix for child elements
  dataTestId: string;
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      avatars,
      max,
      variant,
      className,
      overflowIndicatorClassName,
      dataTestId,
      ...props
    },
    ref,
  ) => {
    const numAvatars = avatars.length;
    let displayedAvatars = avatars;
    let overflowCount = 0;

    if (max && numAvatars > max) {
      displayedAvatars = avatars.slice(0, max - 1);
      overflowCount = numAvatars - (max - 1);
    }

    return (
      <div
        ref={ref}
        className={cn(
          avatarGroupClassName({ variant }),
          "[&>[data-slot=avatar]]:ring-background [&>[data-slot=avatar]]:ring-2",
          className,
        )}
        data-testid={dataTestId}
        {...props}
      >
        {displayedAvatars.map((avatarData, index) => (
          <Tooltip key={`avatar-tooltip-${index}`}>
            <TooltipTrigger asChild>
              <Avatar
                className={cn("h-10 w-10", avatarData.className)}
                data-slot="avatar"
                data-testid={
                  dataTestId ? `${dataTestId}-avatar-${index}` : undefined
                }
              >
                {avatarData.src ? (
                  <AvatarImage src={avatarData.src} alt={avatarData.alt} />
                ) : (
                  <AvatarFallback>{avatarData.fallback}</AvatarFallback>
                )}
              </Avatar>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              data-testid={
                dataTestId ? `${dataTestId}-avatar-${index}-tooltip` : undefined
              }
            >
              {avatarData.name}
            </TooltipContent>
          </Tooltip>
        ))}
        {overflowCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar
                className={cn("h-10 w-10", overflowIndicatorClassName)}
                data-slot="avatar"
                data-testid={dataTestId ? `${dataTestId}-overflow` : undefined}
              >
                <AvatarFallback>{`+${overflowCount}`}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              data-testid={
                dataTestId ? `${dataTestId}-overflow-tooltip` : undefined
              }
            >
              {`${overflowCount} more user${overflowCount > 1 ? "s" : ""}`}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";
