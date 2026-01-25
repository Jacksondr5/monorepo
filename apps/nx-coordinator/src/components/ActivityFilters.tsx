"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface ActivityFiltersProps {
  availableProjects: string[];
  availableTasks: string[];
}

export function ActivityFilters({
  availableProjects,
  availableTasks,
}: ActivityFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentProject = searchParams.get("project") ?? "";
  const currentTask = searchParams.get("task") ?? "";
  const currentResult = searchParams.get("result") ?? "";
  const currentSha = searchParams.get("sha") ?? "";

  const hasActiveFilters =
    currentProject || currentTask || currentResult || currentSha;

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/");
  };

  return (
    <div className="mb-4 flex items-center gap-4">
      <select
        value={currentProject}
        onChange={(e) => updateFilters("project", e.target.value)}
        className="text-slate-11 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
      >
        <option value="">All Projects</option>
        {availableProjects.map((project) => (
          <option key={project} value={project}>
            {project}
          </option>
        ))}
      </select>

      <select
        value={currentTask}
        onChange={(e) => updateFilters("task", e.target.value)}
        className="text-slate-11 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
      >
        <option value="">All Tasks</option>
        {availableTasks.map((task) => (
          <option key={task} value={task}>
            {task}
          </option>
        ))}
      </select>

      <select
        value={currentResult}
        onChange={(e) => updateFilters("result", e.target.value)}
        className="text-slate-11 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
      >
        <option value="">All Results</option>
        <option value="granted">Granted</option>
        <option value="blocked">Blocked</option>
      </select>

      <input
        type="text"
        value={currentSha}
        onChange={(e) => updateFilters("sha", e.target.value)}
        placeholder="Filter by SHA..."
        className="text-slate-11 placeholder-slate-11 w-48 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
      />

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-slate-11 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
