"use client";

import { useEffect, useRef } from "react";
import { Important } from "./svg/Important";
import { Urgent } from "./svg/Urgent";
import { TaskInput } from "./TaskInput";
import { cn } from "~/lib/utils";
import { type EditingState, useEditing } from "../contexts/EditingContext";
import { NEW_TASK_ID, useTasks } from "~/contexts/TaskContext";
import { type Id } from "../../convex/_generated/dataModel";

export type TaskProps = {
  _id: Id<"tasks"> | typeof NEW_TASK_ID;
  _creationTime: number;
  description?: string;
  isBlocked: boolean;
  isDone: boolean;
  isImportant?: boolean;
  isUrgent?: boolean;
  title: string;
};

export const Task = ({
  _id,
  _creationTime,
  description,
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
    if (_id === NEW_TASK_ID) {
      dispatch({
        type: "create",
        value: { createdAt: new Date(_creationTime), title: value },
      });
    } else {
      dispatch({ type: "edit-title", taskId: _id, value });
    }
    taskRef.current?.focus();
  };

  const handleDescriptionChange = (value: string) => {
    console.log("id", _id);
    if (_id !== NEW_TASK_ID) {
      dispatch({ type: "edit-description", taskId: _id, value });
    }
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

    if (e.key === "i" && _id !== NEW_TASK_ID) {
      switch (isImportant) {
        case true:
          dispatch({ type: "edit-important", taskId: _id, value: false });
          break;
        case false:
          dispatch({ type: "edit-important", taskId: _id, value: undefined });
          break;
        case undefined:
          dispatch({ type: "edit-important", taskId: _id, value: true });
          break;
      }
    } else if (e.key === "u" && _id !== NEW_TASK_ID) {
      switch (isUrgent) {
        case true:
          dispatch({ type: "edit-urgent", taskId: _id, value: false });
          break;
        case false:
          dispatch({ type: "edit-urgent", taskId: _id, value: undefined });
          break;
        case undefined:
          dispatch({ type: "edit-urgent", taskId: _id, value: true });
          break;
      }
    } else if (e.key === "b" && _id !== NEW_TASK_ID) {
      dispatch({ type: "edit-blocked", taskId: _id, value: !isBlocked });
    } else if (e.key === "e") {
      setEditingState({
        target: "title",
        taskCreatedAtTimestamp: new Date(_creationTime).toISOString(),
      });
      titleEditRef.current?.focus();
    } else if (e.key === "d") {
      setEditingState({
        target: "description",
        taskCreatedAtTimestamp: new Date(_creationTime).toISOString(),
      });
      descriptionEditRef.current?.focus();
    } else if (e.key === "q" && _id !== NEW_TASK_ID) {
      dispatch({ type: "edit-done", taskId: _id, value: !isDone });
    } else if (e.key === "x" && _id !== NEW_TASK_ID) {
      dispatch({ type: "delete-task", taskId: _id });
    }
  };

  useEffect(() => {
    // When a new task is created, focus the title input
    if (_id === NEW_TASK_ID) {
      setEditingState({
        target: "title",
        taskCreatedAtTimestamp: new Date(_creationTime).toISOString(),
      });
      titleEditRef.current?.focus();
    } else if (_id === focusedTaskId) {
      taskRef.current?.focus();
    }
    // This is fine, we only need to run this when the task is created or focused
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id, focusedTaskId]);

  return (
    <TaskView
      _id={_id}
      _creationTime={_creationTime}
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

export type TaskViewProps = Omit<TaskProps, "updatedAt"> & {
  descriptionEditRef: React.RefObject<HTMLTextAreaElement | null>;
  editingState: EditingState | undefined;
  handleDescriptionChange: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleTitleChange: (value: string) => void;
  taskRef: React.RefObject<HTMLDivElement | null>;
  titleEditRef: React.RefObject<HTMLInputElement | null>;
};

export const TaskView = ({
  _id,
  _creationTime,
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
      data-testid={`task-${_id}`}
    >
      <div className="flex items-center justify-between gap-2">
        {editingState?.taskCreatedAtTimestamp ===
          new Date(_creationTime).toISOString() &&
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
      {editingState?.taskCreatedAtTimestamp ===
        new Date(_creationTime).toISOString() &&
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
