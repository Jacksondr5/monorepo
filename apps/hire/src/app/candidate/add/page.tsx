"use client";

import { Doc } from "../../../../convex/_generated/dataModel";
import { CandidateForm } from "../../../components/candidate-form";

type Candidate = Omit<Doc<"candidates">, "_id" | "_creationTime">;

export default function AddCandidatePage() {
  const onSubmit = async (data: Candidate) => {
    console.log("Submitting candidate:", data);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="mb-6 text-3xl font-bold">Add a Candidate</h1>
      <CandidateForm onSubmit={onSubmit} />
    </div>
  );
}
