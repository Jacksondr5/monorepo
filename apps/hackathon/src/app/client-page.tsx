"use client";

import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { ProjectCard } from "~/components/projects/project-card";
import { ProjectSubmissionForm } from "~/components/project-submission/project-submission-form";
import { usePostHog } from "posthog-js/react";
import { captureException } from "@sentry/nextjs";

export interface ClientPageProps {
  preloadedLatestHackathon: Preloaded<
    typeof api.hackathonEvents.getLatestHackathonEvent
  >;
  preloadedCurrentUser: Preloaded<typeof api.users.getCurrentUser>;
  preloadedProjects: Preloaded<typeof api.projects.getProjectsByHackathonEvent>;
}

export const ClientPage = ({
  preloadedLatestHackathon,
  preloadedCurrentUser,
  preloadedProjects,
}: ClientPageProps) => {
  // We know it isn't null because this component
  // is only shown if there is an active hackathon event
  const latestHackathon = usePreloadedQuery(preloadedLatestHackathon);
  const currentUser = usePreloadedQuery(preloadedCurrentUser);
  const { projects, visibleUsers: visibleUsersArray } =
    usePreloadedQuery(preloadedProjects);

  const visibleUsers = new Map(
    visibleUsersArray.map((user) => [user._id, user]),
  );

  const createProject = useMutation(api.projects.createProject);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(
    null,
  );
  const postHog = usePostHog();

  if (!latestHackathon) throw new Error("Expected latest hackathon to exist");

  const handleSubmitProject = async (data: {
    title: string;
    description: string;
  }) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(null);

    try {
      const id = await createProject({
        data: {
          ...data,
          hackathonEventId: latestHackathon._id,
        },
      });
      setSubmissionSuccess(`Project submitted successfully!`);
      postHog.capture("project_created", {
        project_id: id,
        title: data.title,
      });
      // Optionally, reset form or redirect
    } catch (error) {
      console.error("Failed to submit project:", error);
      captureException(error);
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Failed to submit project. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasProjects = projects.length > 0;

  return (
    <div>
      <div className="w-4xl">
        <h2 className="text-slate-12 mb-4 text-center text-3xl font-semibold">
          Submitted Projects
        </h2>
        <div className="flex flex-col">
          {!hasProjects && (
            <p className="text-slate-10">
              No projects submitted yet for {latestHackathon.name}. Be the
              first!
            </p>
          )}
          {hasProjects &&
            projects.map((project) => (
              <ProjectCard
                key={project._id}
                currentUser={currentUser}
                project={project}
                isEditable={currentUser?._id === project.creatorUserId}
                userMap={visibleUsers}
              />
            ))}
        </div>
      </div>
      <hr className="border-slate-6 my-8 w-full max-w-4xl" />
      <div className="w-full">
        <h2 className="text-slate-12 mb-4 text-center text-3xl font-semibold">
          Submit Your Project Idea
        </h2>
        <div className="flex justify-center">
          <ProjectSubmissionForm
            onSubmit={handleSubmitProject}
            isSubmitting={isSubmitting}
          />
        </div>
        {submissionError && (
          <p className="mt-4 text-center text-red-700">
            Error: {submissionError}
          </p>
        )}
        {submissionSuccess && (
          <p className="mt-4 text-center text-green-700">{submissionSuccess}</p>
        )}
      </div>
    </div>
  );
};
