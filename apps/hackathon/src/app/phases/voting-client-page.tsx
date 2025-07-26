"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useMemo } from "react";
import { FinalizedProjectCard } from "~/components/finalized-projects/finalized-project-card";
import { unwrapSerializableResult } from "~/lib/errors";
import { ErrorState } from "~/components/ErrorState";

export interface VotingClientPageProps {
  preloadedProjectVotingData: Preloaded<
    typeof api.projectVoting.getProjectVotingData
  >;
}

export const VotingClientPage = ({
  preloadedProjectVotingData,
}: VotingClientPageProps) => {
  const projectVotingDataResult = usePreloadedQuery(preloadedProjectVotingData);

  const projectVotingData = unwrapSerializableResult(
    projectVotingDataResult,
    "Failed to fetch project voting data",
  );

  // Extract data with fallbacks to ensure hooks are always called
  const {
    hackathon: latestHackathon,
    currentUser,
    finalizedProjects,
  } = projectVotingData || {
    hackathon: null,
    currentUser: null,
    finalizedProjects: { projects: [], visibleUsers: [] },
  };
  const { projects, visibleUsers: visibleUsersArray } = finalizedProjects;

  // Calculate current user's interests from the projects data
  const currentUserInterests = useMemo(() => {
    if (!currentUser || !projects) return new Set<string>();

    const interestedProjectIds = new Set<string>();
    projects.forEach((project) => {
      const isUserInterested = project.interestedUsers.some(
        (interestedUser) => interestedUser.userId === currentUser._id,
      );
      if (isUserInterested) {
        interestedProjectIds.add(project._id);
      }
    });
    return interestedProjectIds;
  }, [projects, currentUser]);

  const visibleUsers = useMemo(() => {
    if (!visibleUsersArray) return new Map();
    return new Map(visibleUsersArray.map((user) => [user._id, user]));
  }, [visibleUsersArray]);

  // Show error state if critical data failed to load
  if (!projectVotingData || !latestHackathon || !currentUser) {
    return (
      <ErrorState
        title="Project Voting"
        errorTitle="Unable to Load Project Voting Data"
        errorMessage="There was an error loading the project voting data."
        dataTestId="project-voting-error-state"
      />
    );
  }

  const hasProjects = projects.length > 0;
  const maxInterests = 3;

  const remainingInterests = Math.max(
    maxInterests - currentUserInterests.size,
    0,
  );

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-slate-11 text-4xl font-bold">
          {latestHackathon.name}
        </h1>
        <p className="text-slate-11 text-lg">
          Project Voting Phase - Select up to 3 projects you&apos;re interested
          in working on
        </p>
      </div>
      <div
        className={`mb-4 rounded-lg p-3 text-center text-sm font-medium ${
          remainingInterests > 0
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {remainingInterests > 0
          ? `You have ${remainingInterests} interest${remainingInterests === 1 ? "" : "s"} remaining`
          : "You have used all your interests"}
      </div>

      <div className="w-full">
        <h2 className="text-slate-12 mb-4 text-center text-3xl font-semibold">
          Finalized Projects
        </h2>
        <div className="flex flex-col">
          {!hasProjects && (
            <p className="text-slate-10 text-center">
              No finalized projects available yet for {latestHackathon.name}.
            </p>
          )}
          {hasProjects &&
            projects.map((project) => (
              <FinalizedProjectCard
                key={project._id}
                currentUser={currentUser}
                project={project}
                userMap={visibleUsers}
                remainingInterests={remainingInterests}
                hackathonPhase={latestHackathon.currentPhase}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
