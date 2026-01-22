interface BreakdownItem {
  blocked: number;
  project?: string;
  task?: string;
  total: number;
}

interface BreakdownSectionProps {
  byProject: Array<{ blocked: number; project: string; total: number }>;
  byTask: Array<{ blocked: number; task: string; total: number }>;
}

function BreakdownList({ items, label }: { items: BreakdownItem[]; label: string }) {
  // Sort by total count descending
  const sortedItems = [...items].sort((a, b) => b.total - a.total);

  if (sortedItems.length === 0) {
    return <p className="text-slate-500 text-sm">No data yet</p>;
  }

  return (
    <div className="space-y-4">
      {sortedItems.map((item) => {
        const itemLabel = item.project || item.task || 'Unknown';
        const blockedPercentage = item.total > 0 ? (item.blocked / item.total) * 100 : 0;

        return (
          <div key={itemLabel}>
            <div className="flex justify-between text-sm text-slate-400 mb-1">
              <span>{itemLabel}</span>
              <span>
                {item.blocked} blocked / {item.total} total
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500"
                style={{ width: `${blockedPercentage}%` }}
              />
            </div>
            <div className="text-right text-sm text-slate-400 mt-1">
              {blockedPercentage.toFixed(1)}% blocked
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BreakdownSection({ byProject, byTask }: BreakdownSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-200 mb-4">By Project</h3>
        <BreakdownList items={byProject} label="project" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-200 mb-4">By Task</h3>
        <BreakdownList items={byTask} label="task" />
      </div>
    </div>
  );
}
