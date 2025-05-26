"use client";

import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@j5/component-library";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState, useMemo } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Trash2, Pencil } from "lucide-react";
import { EditBoardSheet } from "./edit-board-sheet";
import { ZodBoard } from "~/server/zod/board";

// We might need a SortableList similar to SortableTagList if boards are orderable
// For now, a simple list will do.

export function BoardsTab({ orgId }: { orgId: string }) {
  const [boardName, setBoardName] = useState("");
  // Assuming a query like getBoardsByOrgId exists in your convex/boards.ts
  const boards = useQuery(api.boards.getBoardsByOrgId, { orgId }) || [];
  const allKanbanStages =
    useQuery(api.kanbanStages.getKanbanStages, { orgId }) || []; // Fetch all stages
  const [localBoards, setLocalBoards] = useState(boards);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<ZodBoard | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [boardToDeleteId, setBoardToDeleteId] = useState<Id<"boards"> | null>(
    null,
  );

  // Assuming a mutation like addBoard exists in your convex/boards.ts
  const addBoard = useMutation(api.boards.addBoard);
  const deleteBoardMutation = useMutation(api.boards.deleteBoard);
  // TODO: add reorder functionality
  // Placeholder for future mutations
  // const reorderBoards = useMutation(api.boards.reorderBoards);

  // Create a map for quick lookup of stage names by ID
  const stageNameMap = useMemo(() => {
    const map = new Map<Id<"kanbanStages">, string>();
    allKanbanStages.forEach((stage) => {
      map.set(stage._id, stage.name);
    });
    return map;
  }, [allKanbanStages]);

  useEffect(() => {
    setLocalBoards(boards);
  }, [boards]);

  const handleAddBoard = async () => {
    if (!boardName.trim()) return;
    try {
      // Assuming addBoard takes name and orgId
      await addBoard({ name: boardName.trim(), orgId });
      setBoardName("");
    } catch (error) {
      console.error("Failed to add board:", error);
      // TODO: add toast
    }
  };

  const handleDeleteBoard = (boardId: Id<"boards">) => {
    setBoardToDeleteId(boardId);
    setIsDeleteDialogOpen(true);
  };

  const executeDeleteBoard = async () => {
    if (!boardToDeleteId || !orgId) return;
    try {
      await deleteBoardMutation({ boardId: boardToDeleteId, orgId });
      // TODO: add toast success
    } catch (error) {
      console.error("Failed to delete board:", error);
      // TODO: add toast error
    }
    setIsDeleteDialogOpen(false);
    setBoardToDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Manage Boards</h2>
      <p className="text-muted-foreground text-sm">
        Create and manage boards for your hiring pipelines.
      </p>
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="New board name"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddBoard()}
          className="max-w-xs"
        />
        <Button onClick={handleAddBoard} disabled={!boardName.trim()}>
          Add Board
        </Button>
      </div>
      <div className="rounded-lg border">
        {localBoards.length === 0 ? (
          <p className="text-muted-foreground p-4 text-center">
            No boards created yet.
          </p>
        ) : (
          <ul className="divide-border divide-y">
            {localBoards?.map((board) => (
              <li
                key={board._id}
                className="flex items-center justify-between border-b p-2"
              >
                <div>
                  <span className="font-medium">{board.name}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    Slug: {board.slug}
                  </span>
                  <div className="ml-4 mt-1 text-xs text-gray-600">
                    <span className="font-semibold">Stages: </span>
                    {board.kanbanStageIds?.length > 0
                      ? board.kanbanStageIds
                          .map(
                            (stageId) => stageNameMap.get(stageId) || stageId,
                          )
                          .join(", ")
                      : "No stages"}
                  </div>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingBoard(board);
                      setIsEditSheetOpen(true);
                    }}
                    aria-label="Edit board"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteBoard(board._id)}
                    aria-label="Delete board"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {editingBoard && (
        <EditBoardSheet
          isOpen={isEditSheetOpen}
          onOpenChange={setIsEditSheetOpen}
          board={editingBoard}
          orgId={orgId}
        />
      )}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Board</DialogTitle>
          </DialogHeader>
          <p className="text-center">
            Are you sure you want to delete this board? <br />
            This action cannot be undone.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={executeDeleteBoard}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
