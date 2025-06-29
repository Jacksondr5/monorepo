"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { FinalizedProject } from "~/server/zod/finalized-project";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@j5/component-library";
import { ZodUser, ZodUserId, HackathonPhase } from "~/server/zod";
import { usePostHog } from "posthog-js/react";
import { processError } from "~/lib/errors";
import { useState } from "react";
import { Comments } from "../shared/comments";
import { getInitials } from "~/lib/get-initials";

interface FinalizedProjectCardProps {
  currentUser: ZodUser;
  project: FinalizedProject;
  userMap: Map<string, ZodUser>;
  remainingInterests: number;
  hackathonPhase: HackathonPhase;
  showBothUserGroups?: boolean; // true for admin page, false/undefined for user pages
}

export function FinalizedProjectCard({
  currentUser,
  project,
  userMap,
  remainingInterests,
  hackathonPhase,
  showBothUserGroups,
}: FinalizedProjectCardProps) {
  const addInterestedUserMutation = useMutation(
    api.finalizedProjects.addInterestedUser,
  );
  const removeInterestedUserMutation = useMutation(
    api.finalizedProjects.removeInterestedUser,
  );
  const assignUserToProjectMutation = useMutation(
    api.finalizedProjects.assignUserToProject,
  );

  const allUsersQuery = useQuery(api.finalizedProjects.getAllUsers);
  const postHog = usePostHog();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

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

  const handleAssignUser = async () => {
    if (!selectedUserId) return;

    setIsAssigning(true);
    try {
      const result = await assignUserToProjectMutation({
        projectId: project._id,
        userId: selectedUserId as ZodUserId,
      });

      if (result.ok) {
        setSelectedUserId("");
        postHog.capture("user_assigned_to_project", {
          projectId: project._id,
          assignedUserId: selectedUserId,
          adminUserId: currentUser._id,
        });
      } else {
        processError(result.error, "Failed to assign user to project");
      }
    } finally {
      setIsAssigning(false);
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

  // Prepare avatar data for assigned users
  const assignedUsersAvatars: AvatarDataItem[] = (
    project.assignedUsers || []
  ).map((assignedUser) => {
    const user = userMap.get(assignedUser.userId);
    return {
      src: user?.avatarUrl,
      alt: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
      fallback: user ? getInitials(user.firstName, user.lastName) : "??",
      id: user?._id ?? "",
      name: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
    };
  });

  // Get all users for the select dropdown
  const allUsers = allUsersQuery?.ok ? allUsersQuery.value : [];
  const assignedUserIds = new Set(
    (project.assignedUsers || []).map((au) => au.userId),
  );
  const availableUsers = allUsers.filter(
    (user) => !assignedUserIds.has(user._id),
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
  const isAdmin = currentUser.role === "ADMIN";

  // Determine what to show based on context
  let showInterestedUsers: boolean;
  let showAssignedUsers: boolean;
  let showInterestButton: boolean;
  let showAssignmentControls: boolean;

  if (showBothUserGroups) {
    // Admin page - show both groups and admin controls
    showInterestedUsers = true;
    showAssignedUsers = true;
    showInterestButton = false;
    showAssignmentControls = isAdmin && availableUsers.length > 0;
  } else {
    // User pages - show contextually appropriate group
    showInterestedUsers = hackathonPhase === "PROJECT_VOTING";
    showAssignedUsers =
      hackathonPhase === "EVENT_IN_PROGRESS" ||
      hackathonPhase === "EVENT_ENDED";
    showInterestButton = hackathonPhase === "PROJECT_VOTING";
    showAssignmentControls = false;
  }

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
        {showInterestButton && (
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
        )}
      </CardHeader>
      <CardContent>
        <p className="text-slate-11 mb-4 whitespace-pre-wrap text-sm">
          {project.description}
        </p>

        {/* Assigned users section */}
        {showAssignedUsers && (
          <>
            <Separator className="my-4" />
            <div className="mb-4">
              <p className="text-slate-10 mb-4 text-xs font-semibold">
                Assigned Team Members ({(project.assignedUsers || []).length}):
              </p>
              {(project.assignedUsers || []).length > 0 ? (
                <AvatarGroup
                  avatars={assignedUsersAvatars}
                  max={10}
                  dataTestId={`finalized-project-${project._id}-assigned-users`}
                />
              ) : (
                <p className="text-slate-9 text-xs italic">
                  No team members assigned yet
                </p>
              )}
            </div>
          </>
        )}

        {/* Admin assignment controls */}
        {showAssignmentControls && (
          <div className="border-slate-6 bg-slate-2 mb-4 rounded-lg border p-3">
            <p className="text-slate-11 mb-2 text-xs font-semibold">
              Assign Team Member:
            </p>
            <div className="flex gap-2">
              <Select
                value={selectedUserId}
                onValueChange={setSelectedUserId}
                dataTestId={`assign-user-select-${project._id}`}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a user to assign..." />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAssignUser}
                disabled={!selectedUserId || isAssigning}
                size="sm"
                dataTestId={`assign-user-button-${project._id}`}
              >
                {isAssigning ? "Assigning..." : "Assign"}
              </Button>
            </div>
          </div>
        )}

        {/* Interested users avatars */}
        {showInterestedUsers && project.interestedUsers.length > 0 && (
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

        <Comments
          projectId={project._id}
          comments={project.comments}
          currentUser={currentUser}
          userMap={userMap}
          config={{
            type: "finalizedProject",
            postHogEventTarget: "finalized_project_comment",
            testIdTarget: "finalized-project-comment",
          }}
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
