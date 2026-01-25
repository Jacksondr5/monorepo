"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  // Clamp to non-negative to avoid negative "ago" strings for future timestamps
  const diff = Math.max(0, now - timestamp);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

interface ActivityTableProps {
  filters?: {
    gitShaPrefix?: string;
    project?: string;
    task?: string;
    wasGranted?: boolean;
  };
}

export function ActivityTable({ filters }: ActivityTableProps) {
  const data = useQuery(api.queries.getRecentAttempts, filters ?? {});

  if (!data) {
    // Loading skeleton
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-800">
            <tr>
              <th className="text-slate-11 px-4 py-3 text-left text-sm">
                Time
              </th>
              <th className="text-slate-11 px-4 py-3 text-left text-sm">
                Project
              </th>
              <th className="text-slate-11 px-4 py-3 text-left text-sm">
                Task
              </th>
              <th className="text-slate-11 px-4 py-3 text-left text-sm">
                Git SHA
              </th>
              <th className="text-slate-11 px-4 py-3 text-left text-sm">
                Agent
              </th>
              <th className="text-slate-11 px-4 py-3 text-left text-sm">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-slate-800">
                <td className="px-4 py-3">
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-700" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-700" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-700" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-700" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-28 animate-pulse rounded bg-slate-700" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-6 w-20 animate-pulse rounded bg-slate-700" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.attempts.length === 0) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 text-center">
        <p className="text-slate-11">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-slate-800">
          <tr>
            <th className="text-slate-11 px-4 py-3 text-left text-sm">Time</th>
            <th className="text-slate-11 px-4 py-3 text-left text-sm">
              Project
            </th>
            <th className="text-slate-11 px-4 py-3 text-left text-sm">Task</th>
            <th className="text-slate-11 px-4 py-3 text-left text-sm">
              Git SHA
            </th>
            <th className="text-slate-11 px-4 py-3 text-left text-sm">Agent</th>
            <th className="text-slate-11 px-4 py-3 text-left text-sm">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {data.attempts.map((attempt) => (
            <tr
              key={attempt._id}
              className="border-b border-slate-800 hover:bg-slate-800/50"
            >
              <td className="text-slate-11 px-4 py-3">
                {formatRelativeTime(attempt.attemptedAt)}
              </td>
              <td className="text-slate-11 px-4 py-3">{attempt.project}</td>
              <td className="text-slate-11 px-4 py-3">{attempt.task}</td>
              <td className="text-slate-11 px-4 py-3 font-mono text-sm">
                {attempt.gitSha.substring(0, 7)}
              </td>
              <td className="text-slate-11 px-4 py-3">{attempt.agentId}</td>
              <td className="px-4 py-3">
                {attempt.wasGranted ? (
                  <span className="inline-flex rounded-full bg-green-900/50 px-3 py-1 text-xs font-medium text-green-400">
                    Granted
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-red-900/50 px-3 py-1 text-xs font-medium text-red-400">
                    Blocked
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
