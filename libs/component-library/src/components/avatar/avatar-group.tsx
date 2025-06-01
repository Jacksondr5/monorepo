import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export interface AvatarDataItem {
  src?: string;
  alt?: string;
  fallback: string;
  className?: string; // Optional className for individual avatars
}

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
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    { avatars, max, variant, className, overflowIndicatorClassName, ...props },
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
        {...props}
      >
        {displayedAvatars.map((avatarData, index) => (
          <Avatar
            key={`avatar-${index}`}
            className={cn("h-10 w-10", avatarData.className)}
            data-slot="avatar"
          >
            {avatarData.src ? (
              <AvatarImage src={avatarData.src} alt={avatarData.alt} />
            ) : (
              <AvatarFallback>{avatarData.fallback}</AvatarFallback>
            )}
          </Avatar>
        ))}
        {overflowCount > 0 && (
          <Avatar
            className={cn("h-10 w-10", overflowIndicatorClassName)}
            data-slot="avatar"
          >
            <AvatarFallback>{`+${overflowCount}`}</AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";
