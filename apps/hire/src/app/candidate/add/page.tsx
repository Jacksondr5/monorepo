"use client";

import { CandidateForm } from "../../../components/candidate/candidate-form";
import { useOrganization } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  CreateCandidateSchema,
  ZodCreateCandidate,
} from "../../../server/zod/candidate";

export default function AddCandidatePage() {
  const { organization } = useOrganization();
  const addCandidateMutation = useMutation(api.candidates.createCandidate);
  const organizationId = organization?.id;
  if (!organizationId) {
    return null;
  }

  const onSubmit = async (data: ZodCreateCandidate) => {
    // TODO: add loading state (JAC-67)
    try {
      await addCandidateMutation({
        orgId: organizationId,
        newCandidate: data,
      });
    } catch (error) {
      // TODO: replace with toast (JAC-46)
      console.error("Error adding candidate:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="mb-6 text-3xl font-bold">Add a Candidate</h1>
      <CandidateForm
        onSubmit={onSubmit}
        organizationId={organizationId}
        schema={CreateCandidateSchema}
      />
    </div>
  );
}
