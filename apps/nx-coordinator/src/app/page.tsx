"use client";

import { UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { ActivityFilters } from "~/components/ActivityFilters";
import { ActivityTable } from "~/components/ActivityTable";
import { BreakdownSection } from "~/components/BreakdownSection";
import { StatsCards } from "~/components/StatsCards";

export default function HomePage() {
  const searchParams = useSearchParams();
  const stats = useQuery(api.queries.getStats);
  const allAttempts = useQuery(api.queries.getRecentAttempts, { limit: 100 });

  // Extract unique projects and tasks for filter dropdowns
  const availableProjects = Array.from(
    new Set(allAttempts?.attempts.map((a) => a.project) ?? []),
  ).sort();
  const availableTasks = Array.from(
    new Set(allAttempts?.attempts.map((a) => a.task) ?? []),
  ).sort();

  // Build filters from search params
  const project = searchParams.get("project") ?? undefined;
  const task = searchParams.get("task") ?? undefined;
  const resultParam = searchParams.get("result");
  const wasGranted =
    resultParam === "granted"
      ? true
      : resultParam === "blocked"
        ? false
        : undefined;
  const gitShaPrefix = searchParams.get("sha") ?? undefined;

  const filters = { gitShaPrefix, project, task, wasGranted };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-slate-12 text-2xl font-bold">
              Nx Task Coordinator
            </h1>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StatsCards />

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-slate-11 mb-4 text-xl font-semibold">
            Recent Activity
          </h2>
          <ActivityFilters
            availableProjects={availableProjects}
            availableTasks={availableTasks}
          />
          <ActivityTable filters={filters} />
        </div>

        {/* Project and Task Breakdown */}
        {stats && (
          <div className="mt-8">
            <h2 className="text-slate-11 mb-4 text-xl font-semibold">
              Breakdown by Project and Task
            </h2>
            <BreakdownSection
              byProject={stats.byProject}
              byTask={stats.byTask}
            />
          </div>
        )}
      </main>
    </div>
  );
}
