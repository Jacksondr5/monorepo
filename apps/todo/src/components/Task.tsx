"use client";

import { useEffect, useRef } from "react";
import { Important } from "./svg/Important";
import { Urgent } from "./svg/Urgent";
import { TaskInput } from "./TaskInput";
import { cn } from "~/lib/utils";
import { type EditingState, useEditing } from "../contexts/EditingContext";
import { NEW_TASK_ID, useTasks } from "~/contexts/TaskContext";
export type TaskProps = {
  createdAt: Date;
  description?: string;
  id: number;
  isBlocked: boolean;
  isDone: boolean;
  isImportant?: boolean;
  isUrgent?: boolean;
  title: string;
};

export const Task = ({
  createdAt,
  description,
  id,
  isBlocked,
  isDone,
  isImportant,
  isUrgent,
  title,
}: TaskProps) => {
  const { editingState, setEditingState } = useEditing();
  const { dispatch, focusedTaskId } = useTasks();

  const taskRef = useRef<HTMLDivElement>(null);
  const titleEditRef = useRef<HTMLInputElement>(null);
  const descriptionEditRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleChange = (value: string) => {
    if (id === NEW_TASK_ID) {
      dispatch({ type: "create", value: { createdAt, title: value } });
    } else {
      dispatch({ type: "edit-title", taskId: id, value });
    }
    taskRef.current?.focus();
  };

  const handleDescriptionChange = (value: string) => {
    dispatch({ type: "edit-description", taskId: id, value });
    taskRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (editingState) {
      return;
    }

    // Prevent default if we handle the key
    if (/^[iedqbu]/.test(e.key)) {
      e.preventDefault();
    }

    if (e.key === "i") {
      switch (isImportant) {
        case true:
          dispatch({ type: "edit-important", taskId: id, value: false });
          break;
        case false:
          dispatch({ type: "edit-important", taskId: id, value: undefined });
          break;
        case undefined:
          dispatch({ type: "edit-important", taskId: id, value: true });
          break;
      }
    } else if (e.key === "u") {
      switch (isUrgent) {
        case true:
          dispatch({ type: "edit-urgent", taskId: id, value: false });
          break;
        case false:
          dispatch({ type: "edit-urgent", taskId: id, value: undefined });
          break;
        case undefined:
          dispatch({ type: "edit-urgent", taskId: id, value: true });
          break;
      }
    } else if (e.key === "b") {
      dispatch({ type: "edit-blocked", taskId: id, value: !isBlocked });
    } else if (e.key === "e") {
      setEditingState({
        target: "title",
        taskCreatedAtTimestamp: createdAt.toISOString(),
      });
      titleEditRef.current?.focus();
    } else if (e.key === "d") {
      setEditingState({
        target: "description",
        taskCreatedAtTimestamp: createdAt.toISOString(),
      });
      descriptionEditRef.current?.focus();
    } else if (e.key === "q") {
      dispatch({ type: "edit-done", taskId: id, value: !isDone });
    } else if (e.key === "x") {
      dispatch({ type: "delete-task", taskId: id });
    }
  };

  useEffect(() => {
    // When a new task is created, focus the title input
    if (id === NEW_TASK_ID) {
      setEditingState({
        target: "title",
        taskCreatedAtTimestamp: createdAt.toISOString(),
      });
      titleEditRef.current?.focus();
    } else if (id === focusedTaskId) {
      taskRef.current?.focus();
    }
    // This is fine, we only need to run this when the task is created or focused
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, focusedTaskId]);

  return (
    <TaskView
      id={id}
      createdAt={createdAt}
      isBlocked={isBlocked}
      isDone={isDone}
      isImportant={isImportant}
      isUrgent={isUrgent}
      description={description}
      title={title}
      editingState={editingState}
      handleKeyDown={handleKeyDown}
      handleTitleChange={handleTitleChange}
      handleDescriptionChange={handleDescriptionChange}
      titleEditRef={titleEditRef}
      descriptionEditRef={descriptionEditRef}
      taskRef={taskRef}
    />
  );
};

export type TaskViewProps = TaskProps & {
  descriptionEditRef: React.RefObject<HTMLTextAreaElement | null>;
  editingState: EditingState | undefined;
  handleDescriptionChange: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleTitleChange: (value: string) => void;
  taskRef: React.RefObject<HTMLDivElement | null>;
  titleEditRef: React.RefObject<HTMLInputElement | null>;
};

export const TaskView = ({
  createdAt,
  description,
  isBlocked,
  isDone,
  isImportant,
  isUrgent,
  title,
  editingState,
  handleKeyDown,
  handleTitleChange,
  handleDescriptionChange,
  titleEditRef,
  descriptionEditRef,
  taskRef,
}: TaskViewProps) => {
  return (
    <div
      className={cn(
        "text-olive-12 flex w-full flex-col gap-2 rounded-md border px-4 py-2 focus:outline-2",
        "border-olive-6 bg-olive-2 focus:bg-olive-5 focus:outline-olive-7",
        isBlocked && "border-red-6 bg-red-2 focus:bg-red-5 focus:outline-red-7",
        isDone &&
          "border-grass-6 bg-grass-3 focus:bg-grass-5 focus:outline-grass-7",
      )}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={taskRef}
    >
      <div className="flex items-center justify-between gap-2">
        {editingState?.taskCreatedAtTimestamp === createdAt.toISOString() &&
        editingState?.target === "title" ? (
          <TaskInput
            type="input"
            defaultValue={title}
            onChange={handleTitleChange}
            ref={titleEditRef}
          />
        ) : (
          <h3 className="text-base font-medium">{title}</h3>
        )}
        <div className="flex items-center gap-2">
          {isUrgent !== undefined && (
            <Urgent className="h-6" isUrgent={isUrgent} />
          )}
          {isImportant !== undefined && (
            <Important className="h-6" isImportant={isImportant} />
          )}
        </div>
      </div>
      {editingState?.taskCreatedAtTimestamp === createdAt.toISOString() &&
      editingState?.target === "description" ? (
        <TaskInput
          type="textarea"
          defaultValue={description ?? ""}
          onChange={handleDescriptionChange}
          ref={descriptionEditRef}
        />
      ) : (
        description && (
          <div className="ml-2">
            {description.split("\n").map((line, index) => (
              <p key={index} className="text-base font-light">
                {line}
              </p>
            ))}
          </div>
        )
      )}
    </div>
  );
};
