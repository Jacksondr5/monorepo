"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@j5/component-library";
import { CandidateForm } from "./candidate-form";
import {
  ZodCandidate,
  ZodCreateCandidate,
  ZodUpdateCandidate,
  UpdateCandidateSchema,
} from "~/server/zod/candidate";

interface EditCandidateSheetProps {
  candidate: ZodCandidate;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  organizationId: string;
  onSubmit: (values: ZodUpdateCandidate) => Promise<void>; // Or appropriate callback
}

export function EditCandidateSheet({
  candidate,
  isOpen,
  onOpenChange,
  organizationId,
  onSubmit,
}: EditCandidateSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: ZodCreateCandidate) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...values, _id: candidate._id });
      onOpenChange(false); // Close sheet on successful submit
    } catch (error) {
      console.error("Failed to update candidate:", error);
      // Handle error appropriately, e.g., show a toast message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Candidate</SheetTitle>
          <SheetDescription>
            Update the details for {candidate.name}.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <CandidateForm
            initialData={candidate}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            organizationId={organizationId}
            schema={UpdateCandidateSchema}
          />
        </div>
        {/* SheetFooter can be used if CandidateForm doesn't have its own submit button area */}
        {/* <SheetFooter>
          <Button type="submit" form="candidate-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
