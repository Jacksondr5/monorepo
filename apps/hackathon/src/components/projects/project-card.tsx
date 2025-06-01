"use client";

import { useQuery } from "convex/react";
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
} from "@j5/component-library";
import { Id } from "../../../convex/_generated/dataModel";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const creator = useQuery(api.users.getUserById, {
    userId: project.creatorUserId as Id<"users">,
  });

  const creatorName = () => {
    if (creator === undefined) return "Loading author...";
    if (creator === null) return "Unknown author";
    return `${creator.firstName} ${creator.lastName}`.trim() || "Anonymous";
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const firstInitial = firstName?.[0]?.toUpperCase() || "";
    const lastInitial = lastName?.[0]?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "U"; // Default to 'U' for Unknown User
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <div className="flex items-center gap-2 pt-2">
          <Avatar className="h-6 w-6">
            {creator?.avatarUrl && <AvatarImage src={creator.avatarUrl} alt={creatorName()} />}
            <AvatarFallback className="text-xs">
              {getInitials(creator?.firstName, creator?.lastName)}
            </AvatarFallback>
          </Avatar>
          <CardDescription className="text-xs">
            By: {creatorName()}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-11 line-clamp-3">
          {project.description}
        </p>
        {/* TODO: Display project images here */}
        {/* {project.imageUrls && project.imageUrls.length > 0 && ( ... )} */}
      </CardContent>
      <CardFooter className="text-xs text-slate-9">
        Last updated: {new Date(project.updatedAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
}
