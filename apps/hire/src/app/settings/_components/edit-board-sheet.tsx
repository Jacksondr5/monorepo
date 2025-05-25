"use client";

import * as React from "react";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  useAppForm,
} from "@j5/component-library";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { UpdateBoardSchema } from "../../../server/zod/board";

export type EditBoardSheetProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  board: Doc<"boards">;
  orgId: string;
};

export function EditBoardSheet({
  isOpen,
  onOpenChange,
  board,
  orgId,
}: EditBoardSheetProps) {
  const updateBoardMutation = useMutation(api.boards.updateBoard);
  const allKanbanStages = useQuery(api.kanbanStages.getKanbanStages, { orgId });

  const kanbanStageItems = React.useMemo(() => {
    return (allKanbanStages || []).map((stage) => ({
      id: stage._id,
      label: stage.name,
    }));
  }, [allKanbanStages]);

  const form = useAppForm({
    defaultValues: {
      _id: board._id,
      name: board.name,
      slug: board.slug,
      kanbanStageIds: board.kanbanStageIds,
    },
    validators: {
      onChange: ({ value }) => {
        const result = UpdateBoardSchema.omit({ orgId: true }).safeParse(value);
        if (!result.success) {
          return result.error.flatten().fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        await updateBoardMutation({ orgId, ...value });
        onOpenChange(false); // Close sheet on success
      } catch (error) {
        console.error("Failed to update board:", error);
        // TODO: add toast
      }
    },
  });

  // Reset form if the board prop changes (e.g., user selects a different board to edit)
  React.useEffect(() => {
    form.reset({
      _id: board._id,
      name: board.name,
      slug: board.slug,
      kanbanStageIds: board.kanbanStageIds,
    });
  }, [board, form]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Board</SheetTitle>
          <SheetDescription>
            Make changes to your board&apos;s details here. Click save when
            you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-6 py-6"
        >
          <form.AppField name="name">
            {(field) => <field.FieldInput label="Board Name" />}
          </form.AppField>
          <form.AppField name="slug">
            {(field) => <field.FieldInput label="Slug" />}
          </form.AppField>
          <form.AppField name="kanbanStageIds">
            {(field) => (
              <field.FieldCheckboxGroup
                label="Kanban Stages"
                items={kanbanStageItems}
                orientation="vertical"
              />
            )}
          </form.AppField>
          <SheetFooter className="mt-8">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <form.AppForm>
              <form.SubmitButton
                label={form.state.isSubmitting ? "Saving..." : "Save Changes"}
              />
            </form.AppForm>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
