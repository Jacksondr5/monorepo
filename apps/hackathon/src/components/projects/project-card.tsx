"use client";

import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Project } from "~/server/zod/project";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from "@j5/component-library";
import { useState } from "react";
import { ProjectSubmissionForm } from "../project-submission/project-submission-form";
import { Pencil, ThumbsUp } from "lucide-react";
import { ZodUser } from "~/server/zod";
import { usePostHog } from "posthog-js/react";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { SerializableResult } from "~/convex/model/error";
import {
  RemoveUpvoteFromProjectError,
  UpvoteProjectError,
} from "~/convex/projects";
import { processError } from "~/lib/errors";
import { Comments } from "../shared/comments";
import { getInitials } from "~/lib/get-initials";

interface ProjectCardProps {
  currentUser: ZodUser;
  isEditable: boolean;
  project: Project;
  userMap: Map<string, ZodUser>;
}

export function ProjectCard({
  currentUser,
  project,
  isEditable,
  userMap,
}: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateProjectMutation = useMutation(api.projects.updateProject);
  const upvoteProjectMutation = useMutation(api.projects.upvoteProject);
  const removeUpvoteFromProjectMutation = useMutation(
    api.projects.removeUpvoteFromProject,
  );
  const postHog = usePostHog();
  const creator =
    userMap.get(project.creatorUserId) ??
    ({
      firstName: "Anonymous",
      lastName: "",
      avatarUrl: "",
    } satisfies Pick<ZodUser, "firstName" | "lastName" | "avatarUrl">);

  const onSubmit = async (data: { title: string; description: string }) => {
    const updateProjectResult = await updateProjectMutation({
      id: project._id,
      values: data,
    });
    if (!updateProjectResult.ok) {
      processError(updateProjectResult.error, "Failed to update project");
      return false;
    }
    setIsEditing(false);
    postHog.capture("project_updated", {
      project_id: project._id,
      title: data.title,
    });
    return true;
  };

  const creatorName = () => {
    return `${creator.firstName} ${creator.lastName}`.trim() || "Anonymous";
  };

  const hasUpvoted = project.upvotes.some(
    (upvote) => upvote.userId === currentUser._id,
  );

  if (isEditing)
    return (
      <ProjectSubmissionForm
        onSubmit={onSubmit}
        onCancel={() => setIsEditing(false)}
        defaultData={{ title: project.title, description: project.description }}
        submitButtonLabel="Update Project"
      />
    );
  return (
    <Card className="mb-4 w-full">
      <CardHeader className="flex justify-between gap-2">
        <div>
          <CardTitle>{project.title}</CardTitle>
          <div className="flex items-center gap-2 pt-2">
            <Avatar className="h-6 w-6">
              {creator.avatarUrl && (
                <AvatarImage src={creator.avatarUrl} alt={creatorName()} />
              )}
              <AvatarFallback className="text-xs">
                {getInitials(creator.firstName, creator.lastName)}
              </AvatarFallback>
            </Avatar>
            <CardDescription className="text-xs">
              {creatorName()}
            </CardDescription>
          </div>
        </div>
        {isEditable && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="mr-2"
              dataTestId={`edit-project-${project._id}-button`}
            >
              <Pencil />
            </Button>
            <DeleteProjectDialog projectId={project._id} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-slate-11 whitespace-pre-wrap text-sm">
          {project.description}
        </p>
        {/* TODO: Display project images here */}
        {/* {project.imageUrls && project.imageUrls.length > 0 && ( ... )} */}

        <Comments
          projectId={project._id}
          comments={project.comments}
          currentUser={currentUser}
          userMap={userMap}
          config={{
            type: "project",
            postHogEventTarget: "project_comment",
            testIdTarget: "project-comment",
          }}
        />
      </CardContent>
      <CardFooter className="text-slate-9 flex items-center justify-between text-xs">
        <span>
          Last updated: {new Date(project.updatedAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-10 hover:text-grass-9 h-auto p-1 disabled:opacity-50"
            onClick={async () => {
              let postHogAction = "";
              let mutationResult: SerializableResult<
                void,
                RemoveUpvoteFromProjectError | UpvoteProjectError
              >;
              if (hasUpvoted) {
                mutationResult = await removeUpvoteFromProjectMutation({
                  projectId: project._id,
                });
                postHogAction = "project_upvote_removed";
              } else {
                mutationResult = await upvoteProjectMutation({
                  projectId: project._id,
                });
                postHogAction = "project_upvote_added";
              }

              if (mutationResult.ok) {
                postHog.capture(postHogAction, {
                  projectId: project._id,
                  userId: currentUser._id,
                });
              } else {
                processError(
                  mutationResult.error,
                  "Failed to update project upvote",
                );
              }
            }}
            dataTestId={`upvote-project-${project._id}-button`}
          >
            <ThumbsUp
              className={`h-4 w-4 ${
                hasUpvoted ? "fill-grass-9 text-grass-9" : "text-slate-10"
              }`}
            />
          </Button>
          <span>
            {project.upvotes.length}{" "}
            {project.upvotes.length === 1 ? "upvote" : "upvotes"}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
