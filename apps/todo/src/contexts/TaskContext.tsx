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

// Optimistic update helper functions
const getTasksFromLocalStore = (localStore: any): Task[] | null => {
  const existingTasks = localStore.getQuery(api.tasks.getTasks);
  if (existingTasks && existingTasks.ok) {
    return existingTasks.value;
  }
  return null;
};

const updateTasksInLocalStore = (localStore: any, updatedTasks: Task[]) => {
  localStore.setQuery(
    api.tasks.getTasks,
    {},
    {
      ok: true,
      value: updatedTasks,
    },
  );
};

const updateTaskProperty = <T extends keyof Task>(
  property: T,
  value: Task[T],
  taskId: Id<"tasks">,
) => {
  return (tasks: Task[]) =>
    tasks.map((task) =>
      task._id === taskId
        ? { ...task, [property]: value, updatedAt: Date.now() }
        : task,
    );
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const taskQueryResult = useQuery(api.tasks.getTasks);
  const [newTasks, setNewTasks] = useState<NewTask[]>([]);
  const [focusedTaskId, setFocusedTaskId] = useState<
    Id<"tasks"> | typeof NEW_TASK_ID | undefined
  >(undefined);
  const { setEditingState } = useEditing();

  // Handle the SerializableResult from getTasks
  const taskData = taskQueryResult
    ? handleResult(taskQueryResult, "getTasks")
    : null;

  // Combine real tasks with new tasks
  const tasks: (Task | NewTask)[] = [...(taskData || []), ...newTasks];

  // Set up mutations with optimistic updates
  const createTask = useMutation(api.tasks.createTask).withOptimisticUpdate(
    (localStore, args) => {
      const tasksData = getTasksFromLocalStore(localStore);
      if (tasksData) {
        const now = Date.now();
        const newTask = {
          _id: crypto.randomUUID() as Id<"tasks">,
          _creationTime: now,
          title: args.title,
          isBlocked: false,
          isDone: false,
          createdById: "", // Will be set by server
          updatedAt: now,
        };
        const updatedTasks = [...tasksData, newTask];
        updateTasksInLocalStore(localStore, updatedTasks);
      }
    },
  );

  const setTitle = useMutation(api.tasks.setTitle).withOptimisticUpdate(
    (localStore, args) => {
      const tasksData = getTasksFromLocalStore(localStore);
      if (tasksData) {
        const updatedTasks = updateTaskProperty(
          "title",
          args.title,
          args.id,
        )(tasksData);
        updateTasksInLocalStore(localStore, updatedTasks);
      }
    },
  );

  const setDescription = useMutation(
    api.tasks.setDescription,
  ).withOptimisticUpdate((localStore, args) => {
    const tasksData = getTasksFromLocalStore(localStore);
    if (tasksData) {
      const updatedTasks = updateTaskProperty(
        "description",
        args.description,
        args.id,
      )(tasksData);
      updateTasksInLocalStore(localStore, updatedTasks);
    }
  });

  const setIsBlocked = useMutation(api.tasks.setIsBlocked).withOptimisticUpdate(
    (localStore, args) => {
      const tasksData = getTasksFromLocalStore(localStore);
      if (tasksData) {
        const updatedTasks = updateTaskProperty(
          "isBlocked",
          args.isBlocked,
          args.id,
        )(tasksData);
        updateTasksInLocalStore(localStore, updatedTasks);
      }
    },
  );

  const setIsImportant = useMutation(
    api.tasks.setIsImportant,
  ).withOptimisticUpdate((localStore, args) => {
    const tasksData = getTasksFromLocalStore(localStore);
    if (tasksData) {
      const updatedTasks = updateTaskProperty(
        "isImportant",
        args.isImportant,
        args.id,
      )(tasksData);
      updateTasksInLocalStore(localStore, updatedTasks);
    }
  });

  const setIsUrgent = useMutation(api.tasks.setIsUrgent).withOptimisticUpdate(
    (localStore, args) => {
      const tasksData = getTasksFromLocalStore(localStore);
      if (tasksData) {
        const updatedTasks = updateTaskProperty(
          "isUrgent",
          args.isUrgent,
          args.id,
        )(tasksData);
        updateTasksInLocalStore(localStore, updatedTasks);
      }
    },
  );

  const setIsDone = useMutation(api.tasks.setIsDone).withOptimisticUpdate(
    (localStore, args) => {
      const tasksData = getTasksFromLocalStore(localStore);
      if (tasksData) {
        const updatedTasks = updateTaskProperty(
          "isDone",
          args.isDone,
          args.id,
        )(tasksData);
        updateTasksInLocalStore(localStore, updatedTasks);
      }
    },
  );

  const deleteTask = useMutation(api.tasks.deleteTask).withOptimisticUpdate(
    (localStore, args) => {
      const tasksData = getTasksFromLocalStore(localStore);
      if (tasksData) {
        const updatedTasks = tasksData.filter((task) => task._id !== args.id);
        updateTasksInLocalStore(localStore, updatedTasks);
      }
    },
  );

  const dispatch = async (action: Action) => {
    const now = new Date();
    switch (action.type) {
      case "new-task":
        setNewTasks([
          ...newTasks,
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
        // Remove the new task from local state
        setNewTasks(
          newTasks.filter(
            (task) => task._creationTime !== action.value.createdAt.getTime(),
          ),
        );
        setEditingState(undefined);
        try {
          const result = await createTask({ title: action.value.title });
          const taskId = handleResult(result, "createTask");
          if (taskId) {
            setFocusedTaskId(taskId);
          }
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
            handleResult(result, "setTitle");
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
          handleResult(result, "setDescription");
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
          handleResult(result, "setIsBlocked");
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
          handleResult(result, "setIsImportant");
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
          handleResult(result, "setIsUrgent");
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
          handleResult(result, "setIsDone");
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
