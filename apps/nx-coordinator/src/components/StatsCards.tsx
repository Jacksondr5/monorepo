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
        <div className="text-slate-11 text-sm font-medium">Total Claims</div>
        <div className="text-slate-12 mt-2 text-3xl font-bold">
          {stats.totalAttempts.toLocaleString()}
        </div>
        <div className="text-slate-11 mt-1 text-sm">
          {stats.attemptsLast24h.toLocaleString()} in last 24h
        </div>
      </div>

      {/* Duplicates Blocked */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="text-slate-11 text-sm font-medium">
          Duplicates Blocked
        </div>
        <div className="text-slate-12 mt-2 text-3xl font-bold">
          {stats.duplicatesBlocked.toLocaleString()}
        </div>
        <div className="text-slate-11 mt-1 text-sm">
          {stats.duplicatesBlockedLast24h.toLocaleString()} in last 24h
        </div>
      </div>

      {/* Block Rate */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="text-slate-11 text-sm font-medium">Block Rate</div>
        <div className="text-slate-12 mt-2 text-3xl font-bold">
          {blockRate}%
        </div>
        <div className="text-slate-11 mt-1 text-sm">Overall efficiency</div>
      </div>

      {/* Active Projects */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="text-slate-11 text-sm font-medium">Active Projects</div>
        <div className="text-slate-12 mt-2 text-3xl font-bold">
          {activeProjects}
        </div>
        <div className="text-slate-11 mt-1 text-sm">Using coordinator</div>
      </div>
    </div>
  );
};
