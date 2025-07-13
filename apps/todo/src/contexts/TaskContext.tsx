"use client";

import React, {
  type ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { useEditing } from "~/contexts/EditingContext";
import { useQuery, useMutation } from "#lib/convex";
import { api } from "../../convex/_generated/api";
import { type Id } from "../../convex/_generated/dataModel";
import { type SerializableResult } from "../../convex/model/error";

type Task = {
  _id: Id<"tasks">;
  _creationTime: number;
  title: string;
  description?: string;
  isBlocked: boolean;
  isDone: boolean;
  isImportant?: boolean;
  isUrgent?: boolean;
  createdById: string;
  updatedAt: number;
};

type NewTask = {
  _id: typeof NEW_TASK_ID;
  _creationTime: number;
  title: string;
  description?: string;
  isBlocked: boolean;
  isDone: boolean;
  isImportant?: boolean;
  isUrgent?: boolean;
  createdById: string;
  updatedAt: number;
};

type Action =
  | { type: "new-task" }
  | { type: "refresh" }
  | { type: "create"; value: { title: string; createdAt: Date } }
  | {
      type: "edit-title";
      taskId: Id<"tasks"> | typeof NEW_TASK_ID;
      value: string;
    }
  | { type: "edit-description"; taskId: Id<"tasks">; value: string }
  | { type: "edit-blocked"; taskId: Id<"tasks">; value: boolean }
  | { type: "edit-important"; taskId: Id<"tasks">; value: boolean | undefined }
  | { type: "edit-urgent"; taskId: Id<"tasks">; value: boolean | undefined }
  | { type: "edit-done"; taskId: Id<"tasks">; value: boolean }
  | { type: "delete-task"; taskId: Id<"tasks"> };

export const NEW_TASK_ID = "new-task" as const;

type TaskContextType = {
  dispatch: (action: Action) => void;
  tasks: (Task | NewTask)[];
  focusedTaskId?: Id<"tasks"> | typeof NEW_TASK_ID;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Helper function to handle SerializableResult
const handleResult = <T, E>(
  result: SerializableResult<T, E>,
  operation: string,
): T | null => {
  if (result.ok) {
    return result.value;
  } else {
    console.error(`❌ ${operation || "Operation"} failed:`, result.error);
    // You could add toast notifications here
    return null;
  }
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const taskQueryResult = useQuery(api.tasks.getTasks);
  const [tasks, setTasks] = useState<(Task | NewTask)[]>([]);
  const [focusedTaskId, setFocusedTaskId] = useState<
    Id<"tasks"> | typeof NEW_TASK_ID | undefined
  >(undefined);
  const { setEditingState } = useEditing();

  // Handle the SerializableResult from getTasks
  const taskData = taskQueryResult
    ? handleResult(taskQueryResult, "getTasks")
    : null;

  // Update local tasks when Convex data changes
  React.useEffect(() => {
    if (taskData) {
      setTasks(taskData as Task[]);
    }
  }, [taskData]);

  const createTask = useMutation(api.tasks.createTask);
  const setTitle = useMutation(api.tasks.setTitle);
  const setDescription = useMutation(api.tasks.setDescription);
  const setIsBlocked = useMutation(api.tasks.setIsBlocked);
  const setIsImportant = useMutation(api.tasks.setIsImportant);
  const setIsUrgent = useMutation(api.tasks.setIsUrgent);
  const setIsDone = useMutation(api.tasks.setIsDone);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const dispatch = async (action: Action) => {
    const now = new Date();
    switch (action.type) {
      case "new-task":
        setTasks([
          ...tasks,
          {
            _id: NEW_TASK_ID,
            _creationTime: now.getTime(),
            description: undefined,
            isBlocked: false,
            isDone: false,
            isImportant: undefined,
            isUrgent: undefined,
            title: "",
            updatedAt: now.getTime(),
            createdById: "",
          },
        ]);
        break;
      case "create":
        setTasks(
          tasks.map((task) =>
            task._creationTime === action.value.createdAt.getTime()
              ? { ...task, title: action.value.title }
              : task,
          ),
        );
        setEditingState(undefined);
        try {
          const result = await createTask({ title: action.value.title });
          handleResult(result, "createTask");
        } catch (error) {
          console.error("Failed to create task:", error);
        }
        break;
      case "refresh":
        // Convex handles this automatically with reactivity
        break;
      case "edit-title":
        if (action.taskId !== NEW_TASK_ID) {
          try {
            const result = await setTitle({
              id: action.taskId,
              title: action.value,
            });
            if (handleResult(result, "setTitle") !== null) {
              setTasks(
                tasks.map((task) =>
                  task._id === action.taskId
                    ? { ...task, title: action.value }
                    : task,
                ),
              );
            }
          } catch (error) {
            console.error("Failed to update title:", error);
          }
        }
        setEditingState(undefined);
        break;
      case "edit-description":
        try {
          const result = await setDescription({
            id: action.taskId,
            description: action.value,
          });
          if (handleResult(result, "setDescription") !== null) {
            setTasks(
              tasks.map((task) =>
                task._id === action.taskId
                  ? { ...task, description: action.value }
                  : task,
              ),
            );
          }
        } catch (error) {
          console.error("Failed to update description:", error);
        }
        setEditingState(undefined);
        break;
      case "edit-blocked":
        try {
          const result = await setIsBlocked({
            id: action.taskId,
            isBlocked: action.value,
          });
          if (handleResult(result, "setIsBlocked") !== null) {
            setTasks(
              tasks.map((task) =>
                task._id === action.taskId
                  ? { ...task, isBlocked: action.value }
                  : task,
              ),
            );
          }
        } catch (error) {
          console.error("Failed to update blocked status:", error);
        }
        break;
      case "edit-important":
        try {
          const result = await setIsImportant({
            id: action.taskId,
            isImportant: action.value,
          });
          if (handleResult(result, "setIsImportant") !== null) {
            setTasks(
              tasks.map((task) =>
                task._id === action.taskId
                  ? { ...task, isImportant: action.value }
                  : task,
              ),
            );
          }
        } catch (error) {
          console.error("Failed to update importance:", error);
        }
        break;
      case "edit-urgent":
        try {
          const result = await setIsUrgent({
            id: action.taskId,
            isUrgent: action.value,
          });
          if (handleResult(result, "setIsUrgent") !== null) {
            setTasks(
              tasks.map((task) =>
                task._id === action.taskId
                  ? { ...task, isUrgent: action.value }
                  : task,
              ),
            );
          }
        } catch (error) {
          console.error("Failed to update urgency:", error);
        }
        break;
      case "edit-done":
        try {
          const result = await setIsDone({
            id: action.taskId,
            isDone: action.value,
          });
          if (handleResult(result, "setIsDone") !== null) {
            setTasks(
              tasks.map((task) =>
                task._id === action.taskId
                  ? { ...task, isDone: action.value }
                  : task,
              ),
            );
          }
        } catch (error) {
          console.error("Failed to update done status:", error);
        }
        break;
      case "delete-task":
        try {
          const result = await deleteTask({ id: action.taskId });
          if (handleResult(result, "deleteTask") !== null) {
            // Get the ID of the task after the deleted task
            const deletedIndex = tasks.findIndex(
              (task) => task._id === action.taskId,
            );
            const nextIndex =
              deletedIndex === tasks.length - 1
                ? deletedIndex - 1
                : deletedIndex + 1;
            const nextTaskId = tasks[nextIndex]?._id;
            setTasks(tasks.filter((task) => task._id !== action.taskId));
            setFocusedTaskId(nextTaskId);
          }
        } catch (error) {
          console.error("Failed to delete task:", error);
        }
        break;
      default:
        console.warn("Unknown action type:", action);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        dispatch,
        tasks,
        focusedTaskId,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
