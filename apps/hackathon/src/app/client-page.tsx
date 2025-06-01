"use client";

import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { ProjectCard } from "~/components/projects/project-card";
import { ProjectSubmissionForm } from "~/components/project-submission/project-submission-form";

export interface ClientPageProps {
  preloadedLatestHackathon: Preloaded<
    typeof api.hackathonEvents.getLatestHackathonEvent
  >;
  preloadedConvexUser: Preloaded<typeof api.users.getCurrentUser>;
  preloadedProjects: Preloaded<typeof api.projects.getProjectsByHackathonEvent>;
}

export const ClientPage = ({
  preloadedLatestHackathon,
  preloadedConvexUser,
  preloadedProjects,
}: ClientPageProps) => {
  // We know it isn't null because this component
  // is only shown if there is an active hackathon event
  const latestHackathon = usePreloadedQuery(preloadedLatestHackathon)!;
  const convexUser = usePreloadedQuery(preloadedConvexUser);
  const projects = usePreloadedQuery(preloadedProjects);

  const createProject = useMutation(api.projects.createProject);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(
    null,
  );

  const handleSubmitProject = async (data: {
    title: string;
    description: string;
  }) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(null);

    try {
      await createProject({
        data: {
          ...data,
          hackathonEventId: latestHackathon._id,
        },
      });
      setSubmissionSuccess(`Project submitted successfully!`);
      // Optionally, reset form or redirect
    } catch (error) {
      console.error("Failed to submit project:", error);
      setSubmissionError(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (projects.length === 0)
    return (
      <p className="text-slate-10">
        No projects submitted yet for {latestHackathon.name}. Be the first!
      </p>
    );

  return (
    <div>
      <div className="w-4xl">
        <h2 className="text-slate-12 mb-4 text-center text-3xl font-semibold">
          Submitted Projects
        </h2>
        <div className="flex flex-col">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              isEditable={convexUser?._id === project.creatorUserId}
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
