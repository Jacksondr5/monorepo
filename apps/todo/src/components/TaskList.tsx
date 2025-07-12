"use client";

import { Task } from "./Task";
import { useEffect, useRef } from "react";
import { useEditing } from "../contexts/EditingContext";
import { useTasks } from "~/contexts/TaskContext";
import { partition } from "~/lib/utils";
import dayjs from "dayjs";
export const TaskList = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const { editingState, setEditingState } = useEditing();
  const { dispatch, tasks } = useTasks();

  const now = dayjs();
  const [oldTasks, newTasks] = partition(tasks, (task) => {
    const diff = now.diff(task.updatedAt, "week");
    return diff >= 1;
  });

  // Focus the list when it mounts
  useEffect(() => {
    listRef.current?.focus();
  }, [listRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (editingState) {
      return;
    }

    if (e.key === "a") {
      dispatch({ type: "new-task" });
    }
    if (e.key === "c") {
      setEditingState(undefined);
    }
    if (e.key === "r") {
      dispatch({ type: "refresh" });
    }
  };

  return (
    <div
      className="mt-18 border-grass-3 mx-20 flex w-full flex-col items-center border-2 p-6"
      tabIndex={0}
      ref={listRef}
      onKeyDown={handleKeyDown}
    >
      <div className="flex w-5/6 flex-col items-center justify-center gap-2 xl:w-1/2">
        {newTasks.map((task) => (
          // Use createdAt as the key to avoid losing focus when a new task is created
          <Task key={task.createdAt.toISOString()} {...task} />
        ))}
      </div>
      {oldTasks.length > 0 && (
        <div className="border-orange-3 mt-4 flex w-5/6 flex-col items-center justify-center gap-2 rounded-lg border-4 p-2 xl:w-1/2">
          <h2 className="text-olive-11 text-2xl font-bold">
            Review these tasks
          </h2>
          {oldTasks.map((task) => (
            <Task key={task.createdAt.toISOString()} {...task} />
          ))}
        </div>
      )}
    </div>
  );
};
