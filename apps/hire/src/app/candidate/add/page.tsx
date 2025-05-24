"use client";

import { CandidateForm } from "../../../components/candidate-form";
import { useOrganization } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ZodCreateCandidate } from "../../../server/zod/candidate";

export default function AddCandidatePage() {
  const { organization } = useOrganization();
  const addCandidateMutation = useMutation(api.candidate.createCandidate);
  const organizationId = organization?.id;
  if (!organizationId) {
    return null;
  }

  const onSubmit = async (data: ZodCreateCandidate) => {
    console.log("Submitting candidate:", data);
    await addCandidateMutation({
      ...data,
      organizationId,
    });
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="mb-6 text-3xl font-bold">Add a Candidate</h1>
      <CandidateForm onSubmit={onSubmit} organizationId={organizationId} />
    </div>
  );
}
