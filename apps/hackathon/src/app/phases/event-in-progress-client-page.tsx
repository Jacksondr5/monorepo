"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { FinalizedProjectCard } from "~/components/finalized-projects/finalized-project-card";
import { Skeleton } from "@jacksondr5/component-library";
import type { HackathonEvent } from "~/server/zod";
import { unwrapSerializableResult } from "~/lib/errors";
import { useMemo } from "react";

interface EventInProgressClientPageProps {
  hackathon: HackathonEvent;
}

export function EventInProgressClientPage({
  hackathon,
}: EventInProgressClientPageProps) {
  const finalizedProjectsResult = useQuery(
    api.finalizedProjects.getFinalizedProjectsByHackathonEvent,
    { hackathonEventId: hackathon._id },
  );
  const currentUserResult = useQuery(api.users.getCurrentUser, {});

  const userMap = useMemo(() => {
    const projects = finalizedProjectsResult?.ok
      ? finalizedProjectsResult.value
      : null;
    if (!projects?.visibleUsers) return new Map();
    return new Map(projects.visibleUsers.map((user) => [user._id, user]));
  }, [finalizedProjectsResult]);

  if (!finalizedProjectsResult || !currentUserResult) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:p-8">
        <div className="text-center">
          <h1 className="text-slate-11 text-4xl font-bold">{hackathon.name}</h1>
          <p className="text-slate-11 text-lg">Hackathon in Progress</p>
        </div>
        <div className="w-full max-w-6xl">
          <h2 className="text-slate-12 mb-6 text-center text-2xl font-semibold">
            Project Teams
          </h2>
          <div className="flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  const finalizedProjects = unwrapSerializableResult(
    finalizedProjectsResult,
    "Failed to fetch finalized projects",
  );

  const currentUser = unwrapSerializableResult(
    currentUserResult,
    "Failed to fetch current user",
  );

  // Early return if any data is missing
  if (!finalizedProjects || !currentUser) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:p-8">
        <div className="text-center">
          <h1 className="text-slate-11 text-4xl font-bold">{hackathon.name}</h1>
          <p className="text-slate-11 text-lg">Hackathon in Progress</p>
        </div>
        <div className="max-w-2xl text-center">
          <h2 className="text-slate-12 mb-4 text-2xl font-semibold">
            Error Loading Data
          </h2>
          <p className="text-slate-10 text-lg">
            There was an error loading the project data. Please try again.
          </p>
        </div>
      </main>
    );
  }

  if (finalizedProjects.projects.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:p-8">
        <div className="text-center">
          <h1 className="text-slate-11 text-4xl font-bold">{hackathon.name}</h1>
          <p className="text-slate-11 text-lg">Hackathon in Progress</p>
        </div>
        <div className="max-w-2xl text-center">
          <h2 className="text-slate-12 mb-4 text-2xl font-semibold">
            No Projects Yet
          </h2>
          <p className="text-slate-10 text-lg">
            Projects are still being finalized. Check back soon to see the
            teams!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-slate-11 text-4xl font-bold">{hackathon.name}</h1>
        <p className="text-slate-11 text-lg">Hackathon in Progress</p>
      </div>
      <div className="w-full max-w-6xl">
        <h2 className="text-slate-12 mb-6 text-center text-2xl font-semibold">
          Project Teams
        </h2>
        <div className="flex flex-col gap-6">
          {finalizedProjects.projects.map((project) => (
            <FinalizedProjectCard
              key={project._id}
              project={project}
              currentUser={currentUser}
              userMap={userMap}
              remainingInterests={0}
              hackathonPhase={hackathon.currentPhase}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
