"use client";

import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { ProjectCard } from "~/components/projects/project-card";
import { ProjectSubmissionForm } from "~/components/project-submission/project-submission-form";
import { usePostHog } from "posthog-js/react";
import { processError, unwrapSerializableResult } from "~/lib/errors";
import { ErrorState } from "~/components/ErrorState";

export interface ProjectSubmissionClientPageProps {
  preloadedProjectSubmissionData: Preloaded<
    typeof api.projectSubmission.getProjectSubmissionData
  >;
}

export const ProjectSubmissionClientPage = ({
  preloadedProjectSubmissionData,
}: ProjectSubmissionClientPageProps) => {
  const projectSubmissionDataResult = usePreloadedQuery(
    preloadedProjectSubmissionData,
  );
  const createProject = useMutation(api.projects.createProject);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(
    null,
  );
  const postHog = usePostHog();

  const projectSubmissionData = unwrapSerializableResult(
    projectSubmissionDataResult,
    "Failed to fetch project submission data",
  );

  // Show error state if critical data failed to load
  if (!projectSubmissionData) {
    return (
      <ErrorState
        title="Project Submission"
        errorTitle="Unable to Load Project Submission Data"
        errorMessage="There was an error loading the project submission data."
        containerClassName=""
        dataTestId="project-submission-error-state"
      />
    );
  }

  const {
    hackathon: latestHackathon,
    currentUser,
    projects: projectsResultValue,
  } = projectSubmissionData;
  const { projects, visibleUsers: visibleUsersArray } = projectsResultValue;

  const visibleUsers = new Map(
    visibleUsersArray.map((user) => [user._id, user]),
  );

  const handleSubmitProject = async (data: {
    title: string;
    description: string;
  }) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(null);

    const result = await createProject({
      data: {
        ...data,
        hackathonEventId: latestHackathon._id,
      },
    });
    if (!result.ok) {
      processError(result.error, "Failed to create project");
      setSubmissionError(result.error.message);
      setIsSubmitting(false);
      return false;
    }
    const id = result.value;
    setSubmissionSuccess(`Project submitted successfully!`);
    postHog.capture("project_created", {
      project_id: id,
      title: data.title,
    });
    setIsSubmitting(false);
    return true;
  };

  const hasProjects = projects.length > 0;

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-slate-11 text-4xl font-bold">
          {latestHackathon.name}
        </h1>
        <p className="text-slate-11 text-lg">Project Submission Phase</p>
      </div>
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
