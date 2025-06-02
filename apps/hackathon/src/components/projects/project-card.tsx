"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Project } from "../../server/zod/project";
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
import { Pencil } from "lucide-react";
import posthog from "posthog-js";

interface ProjectCardProps {
  project: Project;
  isEditable: boolean;
}

export function ProjectCard({ project, isEditable }: ProjectCardProps) {
  // TODO: make a better project query that makes this unnecessary
  const creator = useQuery(api.users.getUserById, {
    userId: project.creatorUserId,
  });
  const [isEditing, setIsEditing] = useState(false);
  const updateProject = useMutation(api.projects.updateProject);

  const onSubmit = async (data: { title: string; description: string }) => {
    // TODO: handle failure
    await updateProject({
      id: project._id,
      values: data,
    });
    setIsEditing(false);
    posthog.capture("project_updated", {
      project_id: project._id,
      title: data.title,
    });
  };

  const creatorName = () => {
    if (creator === undefined) return "Loading author...";
    if (creator === null) return "Unknown author";
    return `${creator.firstName} ${creator.lastName}`.trim() || "Anonymous";
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const firstInitial = firstName?.[0]?.toUpperCase() || "";
    const lastInitial = lastName?.[0]?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "??"; // Default to '??' for Unknown User
  };

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
              {creator?.avatarUrl && (
                <AvatarImage src={creator.avatarUrl} alt={creatorName()} />
              )}
              <AvatarFallback className="text-xs">
                {getInitials(creator?.firstName, creator?.lastName)}
              </AvatarFallback>
            </Avatar>
            <CardDescription className="text-xs">
              {creatorName()}
            </CardDescription>
          </div>
        </div>
        {isEditable && (
          <Button
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="mr-2"
          >
            <Pencil />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-slate-11 text-sm">{project.description}</p>
        {/* TODO: Display project images here */}
        {/* {project.imageUrls && project.imageUrls.length > 0 && ( ... )} */}
      </CardContent>
      <CardFooter className="text-slate-9 text-xs">
        Last updated: {new Date(project.updatedAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
}
