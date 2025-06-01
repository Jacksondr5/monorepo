"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ProjectSubmissionForm } from "../components/project-submission/project-submission-form";
import { ProjectCard } from "../components/projects/project-card"; // Added import
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

export default function HomePage() {
  const latestHackathon = useQuery(
    api.hackathonEvents.getLatestHackathonEvent,
    {},
  );

  const projects = useQuery(
    api.projects.getProjectsByHackathonEvent,
    latestHackathon ? { hackathonEventId: latestHackathon._id } : "skip",
  );

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
    if (!latestHackathon) {
      setSubmissionError("No active hackathon event to submit to.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(null);

    try {
      const projectId = await createProject({
        data: {
          ...data,
          hackathonEventId: latestHackathon._id as Id<"hackathonEvents">,
          // `updatedAt` is handled by the mutation itself
        },
      });
      setSubmissionSuccess(`Project submitted successfully! ID: ${projectId}`);
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-slate-11 text-4xl font-bold">
          {latestHackathon === undefined && "Loading Hackathon Info..."}
          {latestHackathon === null && "No Hackathon Event Active"}
          {latestHackathon && latestHackathon.name}
        </h1>
        {latestHackathon && (
          <p className="text-slate-11 text-lg">
            Current Phase: {latestHackathon.currentPhase}
          </p>
        )}
      </div>

      {/* Display Projects List */}
      {latestHackathon && projects === undefined && (
        <p>Loading projects...</p>
      )}
      {latestHackathon && projects && projects.length === 0 && (
        <p className="text-slate-10">
          No projects submitted yet for {latestHackathon.name}. Be the first!
        </p>
      )}
      {latestHackathon && projects && projects.length > 0 && (
        <div className="w-full max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-semibold text-slate-12">
            Submitted Projects
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      )}

      <hr className="my-8 w-full max-w-4xl border-slate-6" />

      {/* Project Submission Form Section */}
      {latestHackathon === undefined && (
        <p className="text-slate-10">Loading submission form...</p>
      )}

      {latestHackathon === null && (
        <p className="text-red-700">
          Cannot submit projects as no hackathon event is currently active.
        </p>
      )}

      {latestHackathon && (
        <div className="w-full">
          <h2 className="mb-4 text-center text-3xl font-semibold text-slate-12">
            Submit Your Project Idea
          </h2>
          <div className="flex justify-center">
            <ProjectSubmissionForm
              onSubmit={handleSubmitProject}
              isSubmitting={isSubmitting}
            />
          </div>
          {submissionError && (
            <p className="mt-4 text-center text-red-700">Error: {submissionError}</p>
          )}
          {submissionSuccess && (
            <p className="mt-4 text-center text-green-700">{submissionSuccess}</p>
          )}
        </div>
      )}
    </main>
  );
}
