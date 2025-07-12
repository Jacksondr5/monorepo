"use client";

import { type inferProcedureOutput } from "@trpc/server";
import { type ReactNode, createContext, useContext, useState } from "react";
import { useEditing } from "~/contexts/EditingContext";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

type Action =
  | { type: "new-task" }
  | { type: "refresh" }
  | { type: "create"; value: { title: string; createdAt: Date } }
  | { type: "edit-title"; taskId: number; value: string }
  | { type: "edit-description"; taskId: number; value: string }
  | { type: "edit-blocked"; taskId: number; value: boolean }
  | { type: "edit-important"; taskId: number; value: boolean | undefined }
  | { type: "edit-urgent"; taskId: number; value: boolean | undefined }
  | { type: "edit-done"; taskId: number; value: boolean }
  | { type: "delete-task"; taskId: number };

export const NEW_TASK_ID = -1;

type TaskContextType = {
  dispatch: (action: Action) => void;
  tasks: inferProcedureOutput<AppRouter["todo"]["get"]>;
  focusedTaskId?: number;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [taskData, taskQuery] = api.todo.get.useSuspenseQuery();
  const [tasks, setTasks] = useState(taskData);
  const [focusedTaskId, setFocusedTaskId] = useState<number | undefined>(
    undefined,
  );
  const { setEditingState } = useEditing();

  const createTask = api.todo.create.useMutation({
    onSuccess: (id, variables) => {
      // Update the task with the new id
      setTasks(
        tasks.map((task) =>
          task.createdAt === variables.createdAt ? { ...task, id } : task,
        ),
      );
    },
  });
  const setTitle = api.todo.setTitle.useMutation();
  const setDescription = api.todo.setDescription.useMutation();
  const setIsBlocked = api.todo.setIsBlocked.useMutation();
  const setIsImportant = api.todo.setIsImportant.useMutation();
  const setIsUrgent = api.todo.setIsUrgent.useMutation();
  const setIsDone = api.todo.setIsDone.useMutation();
  const deleteTask = api.todo.delete.useMutation();
  const refresh = async () => {
    const newTasks = await taskQuery.refetch();
    if (newTasks.data) {
      setTasks(newTasks.data);
    }
  };
  const dispatch = (action: Action) => {
    const now = new Date();
    switch (action.type) {
      case "new-task":
        setTasks([
          ...tasks,
          {
            createdAt: new Date(),
            description: undefined,
            id: NEW_TASK_ID,
            isBlocked: false,
            isDone: false,
            isImportant: undefined,
            isUrgent: undefined,
            title: "",
            updatedAt: now,
          },
        ]);
        break;
      case "create":
        setTasks(
          tasks.map((task) =>
            task.createdAt === action.value.createdAt
              ? { ...task, title: action.value.title }
              : task,
          ),
        );
        setEditingState(undefined);
        createTask.mutate({
          createdAt: action.value.createdAt,
          title: action.value.title,
        });
        break;
      case "refresh":
        void refresh();
        break;
      case "edit-title":
        setTitle.mutate({ id: action.taskId, title: action.value });
        setTasks(
          tasks.map((task) =>
            task.id === action.taskId ? { ...task, title: action.value } : task,
          ),
        );
        setEditingState(undefined);
        break;
      case "edit-description":
        setDescription.mutate({ id: action.taskId, description: action.value });
        setTasks(
          tasks.map((task) =>
            task.id === action.taskId
              ? { ...task, description: action.value }
              : task,
          ),
        );
        setEditingState(undefined);
        break;
      case "edit-blocked":
        setIsBlocked.mutate({ id: action.taskId, isBlocked: action.value });
        setTasks(
          tasks.map((task) =>
            task.id === action.taskId
              ? { ...task, isBlocked: action.value }
              : task,
          ),
        );
        break;
      case "edit-important":
        setIsImportant.mutate({ id: action.taskId, isImportant: action.value });
        setTasks(
          tasks.map((task) =>
            task.id === action.taskId
              ? { ...task, isImportant: action.value }
              : task,
          ),
        );
        break;
      case "edit-urgent":
        setIsUrgent.mutate({ id: action.taskId, isUrgent: action.value });
        setTasks(
          tasks.map((task) =>
            task.id === action.taskId
              ? { ...task, isUrgent: action.value }
              : task,
          ),
        );
        break;
      case "edit-done":
        setIsDone.mutate({ id: action.taskId, isDone: action.value });
        setTasks(
          tasks.map((task) =>
            task.id === action.taskId
              ? { ...task, isDone: action.value }
              : task,
          ),
        );
        break;
      case "delete-task":
        deleteTask.mutate({ id: action.taskId });
        // Get the ID of the task after the deleted task
        const deletedIndex = tasks.findIndex(
          (task) => task.id === action.taskId,
        );
        const nextIndex =
          deletedIndex === tasks.length - 1
            ? deletedIndex - 1
            : deletedIndex + 1;
        const nextTaskId = tasks[nextIndex]?.id;
        setTasks(tasks.filter((task) => task.id !== action.taskId));
        setFocusedTaskId(nextTaskId);
        break;
      default:
        throw new Error("Invalid action");
    }
  };
  return (
    <TaskContext.Provider
      value={{
        dispatch,
        focusedTaskId,
        tasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
