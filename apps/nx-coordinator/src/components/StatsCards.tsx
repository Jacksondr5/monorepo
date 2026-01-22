"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const StatsCards = () => {
  const stats = useQuery(api.queries.getStats);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-slate-700 bg-slate-800 p-6"
          >
            <div className="h-4 w-24 rounded bg-slate-700"></div>
            <div className="mt-2 h-8 w-16 rounded bg-slate-700"></div>
            <div className="mt-1 h-3 w-32 rounded bg-slate-700"></div>
          </div>
        ))}
      </div>
    );
  }

  const blockRate =
    stats.totalAttempts > 0
      ? Math.round((stats.duplicatesBlocked / stats.totalAttempts) * 100)
      : 0;

  const activeProjects = stats.byProject.length;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Claims */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="text-sm font-medium text-slate-400">Total Claims</div>
        <div className="mt-2 text-3xl font-bold text-slate-100">
          {stats.totalAttempts.toLocaleString()}
        </div>
        <div className="mt-1 text-sm text-slate-500">
          {stats.attemptsLast24h.toLocaleString()} in last 24h
        </div>
      </div>

      {/* Duplicates Blocked */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="text-sm font-medium text-slate-400">
          Duplicates Blocked
        </div>
        <div className="mt-2 text-3xl font-bold text-slate-100">
          {stats.duplicatesBlocked.toLocaleString()}
        </div>
        <div className="mt-1 text-sm text-slate-500">
          {stats.duplicatesBlockedLast24h.toLocaleString()} in last 24h
        </div>
      </div>

      {/* Block Rate */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="text-sm font-medium text-slate-400">Block Rate</div>
        <div className="mt-2 text-3xl font-bold text-slate-100">
          {blockRate}%
        </div>
        <div className="mt-1 text-sm text-slate-500">Overall efficiency</div>
      </div>

      {/* Active Projects */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="text-sm font-medium text-slate-400">
          Active Projects
        </div>
        <div className="mt-2 text-3xl font-bold text-slate-100">
          {activeProjects}
        </div>
        <div className="mt-1 text-sm text-slate-500">Using coordinator</div>
      </div>
    </div>
  );
};
