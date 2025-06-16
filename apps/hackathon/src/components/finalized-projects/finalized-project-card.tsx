"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FinalizedProject } from "../../server/zod/finalized-project";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  AvatarGroup,
  type AvatarDataItem,
  Separator,
} from "@j5/component-library";
import { ZodUser } from "~/server/zod";
import { FinalizedProjectComments } from "./finalized-project-comments";
import { usePostHog } from "posthog-js/react";
import { processError } from "~/lib/errors";

interface FinalizedProjectCardProps {
  currentUser: ZodUser;
  project: FinalizedProject;
  userMap: Map<string, ZodUser>;
  remainingInterests: number;
}

export function FinalizedProjectCard({
  currentUser,
  project,
  userMap,
  remainingInterests,
}: FinalizedProjectCardProps) {
  const addInterestedUserMutation = useMutation(
    api.finalizedProjects.addInterestedUser,
  );
  const removeInterestedUserMutation = useMutation(
    api.finalizedProjects.removeInterestedUser,
  );
  const postHog = usePostHog();

  const getInitials = (firstName?: string, lastName?: string) => {
    const firstInitial = firstName?.[0]?.toUpperCase() || "";
    const lastInitial = lastName?.[0]?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "??";
  };

  const isUserInterested = project.interestedUsers.some(
    (interestedUser) => interestedUser.userId === currentUser._id,
  );

  const handleInterestToggle = async () => {
    let mutationResult;
    let postHogAction = "";

    if (isUserInterested) {
      mutationResult = await removeInterestedUserMutation({
        projectId: project._id,
      });
      postHogAction = "finalized_project_interest_removed";
    } else {
      mutationResult = await addInterestedUserMutation({
        projectId: project._id,
      });
      postHogAction = "finalized_project_interest_added";
    }

    if (mutationResult.ok) {
      postHog.capture(postHogAction, {
        projectId: project._id,
        userId: currentUser._id,
      });
    } else {
      processError(mutationResult.error, "Failed to update project interest");
    }
  };

  // Prepare avatar data for interested users
  const interestedUsersAvatars: AvatarDataItem[] = project.interestedUsers.map(
    (interestedUser) => {
      const user = userMap.get(interestedUser.userId);
      return {
        src: user?.avatarUrl,
        alt: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
        fallback: user ? getInitials(user.firstName, user.lastName) : "??",
        id: user?._id ?? "",
        name: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
      };
    },
  );

  // Determine interest button state
  const getInterestButtonProps = () => {
    if (isUserInterested) {
      return {
        variant: "ghost" as const,
        text: "I don't want to work on this",
        disabled: false,
      };
    } else if (remainingInterests > 0) {
      return {
        variant: "default" as const,
        text: "I want to work on this",
        disabled: false,
      };
    } else {
      return {
        variant: "default" as const,
        text: "I want to work on this",
        disabled: true,
      };
    }
  };

  const interestButtonProps = getInterestButtonProps();

  return (
    <Card className="mb-4 w-full">
      <CardHeader className="flex justify-between gap-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <CardDescription className="mt-2 text-xs">
              Finalized Project
            </CardDescription>
          </div>
        </div>
        <Button
          variant={interestButtonProps.variant}
          size="sm"
          onClick={handleInterestToggle}
          disabled={interestButtonProps.disabled}
          dataTestId={`interest-project-${project._id}-button`}
          className={interestButtonProps.disabled ? "opacity-50" : ""}
        >
          {interestButtonProps.text}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-slate-11 mb-4 whitespace-pre-wrap text-sm">
          {project.description}
        </p>
        {/* Interested users avatars */}
        {project.interestedUsers.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="mb-4">
              <p className="text-slate-10 mb-4 text-xs">
                {project.interestedUsers.length}{" "}
                {project.interestedUsers.length === 1 ? "person" : "people"}{" "}
                interested:
              </p>
              <AvatarGroup
                avatars={interestedUsersAvatars}
                max={17}
                dataTestId={`finalized-project-${project._id}-interested-users`}
              />
            </div>
          </>
        )}

        <FinalizedProjectComments
          projectId={project._id}
          comments={project.comments}
          currentUser={currentUser}
          userMap={userMap}
          getInitials={getInitials}
        />
      </CardContent>
      <CardFooter className="text-slate-9 flex items-center justify-between text-xs">
        <span>
          Last updated: {new Date(project.updatedAt).toLocaleDateString()}
        </span>
      </CardFooter>
    </Card>
  );
}
