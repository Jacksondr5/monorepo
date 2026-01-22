"use client";

import { UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ActivityTable } from "~/components/ActivityTable";
import { BreakdownSection } from "~/components/BreakdownSection";
import { StatsCards } from "~/components/StatsCards";

export default function HomePage() {
  const stats = useQuery(api.queries.getStats);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-100">
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
          <h2 className="mb-4 text-xl font-semibold text-slate-200">
            Recent Activity
          </h2>
          <ActivityTable />
        </div>

        {/* Project and Task Breakdown */}
        {stats && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-slate-200">
              Breakdown by Project and Task
            </h2>
            <BreakdownSection byProject={stats.byProject} byTask={stats.byTask} />
          </div>
        )}
      </main>
    </div>
  );
}
