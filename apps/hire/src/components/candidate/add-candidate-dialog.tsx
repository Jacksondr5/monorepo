"use client";

import { useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  CreateCandidateSchema,
  ZodCreateCandidate,
} from "../../server/zod/candidate";
import { CandidateForm } from "./candidate-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Skeleton,
} from "@j5/component-library";
import { PlusIcon } from "lucide-react";

export function AddCandidateDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { organization } = useOrganization();
  const addCandidateMutation = useMutation(api.candidates.createCandidate);
  const organizationId = organization?.id;

  if (!organizationId) {
    return <Skeleton className="bg-grass-4 h-10 w-full" />;
  }

  const onSubmit = async (data: ZodCreateCandidate) => {
    // TODO: add loading state
    // TODO: add toast notifications for success/error
    try {
      await addCandidateMutation({
        orgId: organizationId,
        newCandidate: data,
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          <PlusIcon className="mr-2 h-4 w-4" /> Add Candidate
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new candidate to your pipeline.
          </DialogDescription>
        </DialogHeader>
        <CandidateForm
          onSubmit={onSubmit}
          organizationId={organizationId}
          schema={CreateCandidateSchema}
        />
      </DialogContent>
    </Dialog>
  );
}
