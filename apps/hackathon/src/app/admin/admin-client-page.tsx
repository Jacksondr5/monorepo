"use client";

import { Preloaded, usePreloadedQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { FinalizedProjectCard } from "~/components/finalized-projects/finalized-project-card";
import { FinalizedProjectForm } from "~/components/finalized-projects/finalized-project-form";
import { unwrapSerializableResult, processError } from "~/lib/errors";
import { Button } from "@j5/component-library";
import { usePostHog } from "posthog-js/react";

export interface AdminClientPageProps {
  preloadedLatestHackathon: Preloaded<
    typeof api.hackathonEvents.getLatestHackathonEvent
  >;
  preloadedCurrentUser: Preloaded<typeof api.users.getCurrentUser>;
  preloadedFinalizedProjects: Preloaded<
    typeof api.finalizedProjects.getFinalizedProjectsByHackathonEvent
  >;
}

export const AdminClientPage = ({
  preloadedLatestHackathon,
  preloadedCurrentUser,
  preloadedFinalizedProjects,
}: AdminClientPageProps) => {
  const latestHackathonResult = usePreloadedQuery(preloadedLatestHackathon);
  const currentUserResult = usePreloadedQuery(preloadedCurrentUser);
  const finalizedProjectsResult = usePreloadedQuery(preloadedFinalizedProjects);
  const createFinalizedProject = useMutation(
    api.finalizedProjects.createFinalizedProject,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(
    null,
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const postHog = usePostHog();

  // TODO: actually handle error
  const finalizedProjectsResultValue = unwrapSerializableResult(
    finalizedProjectsResult,
    "Failed to fetch finalized projects",
  );
  const latestHackathon = unwrapSerializableResult(
    latestHackathonResult,
    "Failed to fetch latest hackathon",
  );
  const currentUser = unwrapSerializableResult(
    currentUserResult,
    "Failed to fetch current user",
  );

  if (!finalizedProjectsResultValue || !latestHackathon || !currentUser) {
    return null;
  }

  // Check if user is admin
  if (currentUser.role !== "ADMIN") {
    return (
      <div className="text-center">
        <h2 className="text-slate-12 mb-4 text-2xl font-semibold">
          Access Denied
        </h2>
        <p className="text-slate-10">
          You must be an admin to access this page.
        </p>
      </div>
    );
  }

  const {
    projects: finalizedProjects,
    visibleUsers: finalizedVisibleUsersArray,
  } = finalizedProjectsResultValue;

  const finalizedVisibleUsers = new Map(
    finalizedVisibleUsersArray.map((user) => [user._id, user]),
  );

  const handleCreateFinalizedProject = async (data: {
    title: string;
    description: string;
  }) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(null);

    const result = await createFinalizedProject({
      data: {
        ...data,
        hackathonEventId: latestHackathon._id,
      },
    });
    if (!result.ok) {
      processError(result.error, "Failed to create finalized project");
      setSubmissionError(result.error.message);
      setIsSubmitting(false);
      return false;
    }
    const id = result.value;
    setSubmissionSuccess(`Finalized project created successfully!`);
    postHog.capture("finalized_project_created", {
      project_id: id,
      title: data.title,
    });
    setIsSubmitting(false);
    setShowCreateForm(false);
    return true;
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-slate-12 text-3xl font-semibold">
          Finalized Projects ({finalizedProjects.length})
        </h2>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          dataTestId="toggle-create-finalized-project-form-button"
        >
          {showCreateForm ? "Cancel" : "Create Finalized Project"}
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <FinalizedProjectForm
            onSubmit={handleCreateFinalizedProject}
            isSubmitting={isSubmitting}
            onCancel={() => setShowCreateForm(false)}
          />
          {submissionError && (
            <p className="mt-4 text-center text-red-700">
              Error: {submissionError}
            </p>
          )}
          {submissionSuccess && (
            <p className="mt-4 text-center text-green-700">
              {submissionSuccess}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col">
        {finalizedProjects.length === 0 && (
          <p className="text-slate-10 text-center">
            No finalized projects yet for {latestHackathon.name}.
          </p>
        )}
        {finalizedProjects.map((project) => (
          <FinalizedProjectCard
            key={project._id}
            currentUser={currentUser}
            project={project}
            userMap={finalizedVisibleUsers}
            remainingInterests={0} // Admin view doesn't need interest tracking
          />
        ))}
      </div>
    </div>
  );
};
