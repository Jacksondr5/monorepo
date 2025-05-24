"use client";

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useAppForm,
} from "@j5/component-library";
import { Button } from "@j5/component-library";
import { Card } from "@j5/component-library";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import {
  CreateCandidateSchema,
  ZodCreateCandidate,
} from "../server/zod/candidate";

export type CandidateFormProps = {
  initialData?: ZodCreateCandidate;
  onSubmit: (data: ZodCreateCandidate) => Promise<void> | void;
  isSubmitting?: boolean;
  organizationId: string;
};

export function CandidateForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  organizationId,
}: CandidateFormProps) {
  const form = useAppForm({
    defaultValues: initialData,
    validators: {
      onChange: ({ value }) => {
        console.log(value);
        const results = CreateCandidateSchema.safeParse({
          ...value,
          organizationId,
        });
        if (!results.success) {
          console.log(results.error.flatten().fieldErrors);
          return results.error.flatten().fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const seniorities =
    useQuery(api.seniorities.getSeniorities, { orgId: organizationId }) || [];
  const sources =
    useQuery(api.sources.getSources, { orgId: organizationId }) || [];
  const kanbanStages =
    useQuery(api.kanbanStages.getKanbanStages, { orgId: organizationId }) || [];
  const roles = useQuery(api.roles.getRoles, { orgId: organizationId }) || [];

  return (
    <Card className="w-full max-w-2xl p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <form.AppField
            name="name"
            children={(field) => <field.FieldInput label="Name" />}
          />
          <form.AppField
            name="email"
            children={(field) => (
              <field.FieldInput type="email" label="Email" />
            )}
          />
          <form.AppField
            name="phone"
            children={(field) => <field.FieldInput type="tel" label="Phone" />}
          />
          <form.AppField
            name="seniorityId"
            children={(field) => (
              <field.FieldSelect label="Seniority">
                <SelectTrigger>
                  <SelectValue placeholder="Select a seniority level" />
                </SelectTrigger>
                <SelectContent>
                  {seniorities.map((seniority) => (
                    <SelectItem key={seniority._id} value={seniority._id}>
                      {seniority.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </field.FieldSelect>
            )}
          />
          <form.AppField
            name="sourceId"
            children={(field) => (
              <field.FieldSelect label="Source">
                <SelectTrigger>
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((source) => (
                    <SelectItem key={source._id} value={source._id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </field.FieldSelect>
            )}
          />
          <form.AppField
            name="kanbanStageId"
            children={(field) => (
              <field.FieldSelect label="Kanban Stage">
                <SelectTrigger>
                  <SelectValue placeholder="Select a kanban stage" />
                </SelectTrigger>
                <SelectContent>
                  {kanbanStages.map((kanbanStage) => (
                    <SelectItem key={kanbanStage._id} value={kanbanStage._id}>
                      {kanbanStage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </field.FieldSelect>
            )}
          />
          <form.AppField
            name="salaryExpectations"
            children={(field) => (
              <field.FieldInput label="Salary Expectations" />
            )}
          />
          <form.AppField
            name="nextSteps"
            children={(field) => <field.FieldInput label="Next Steps" />}
          />
          <form.AppField
            name="targetTeam"
            children={(field) => <field.FieldInput label="Target Team" />}
          />
          <form.AppField
            name="roleId"
            children={(field) => (
              <field.FieldSelect label="Role">
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role._id} value={role._id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </field.FieldSelect>
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-slate-12 text-sm font-medium">Resume</label>
          {/* <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  form.setFieldValue("resume", file);
                }
              }}
              className="text-slate-11 file:bg-slate-4 file:text-slate-12 hover:file:bg-slate-5 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
            />
          </div> */}
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <form.AppForm>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
            <form.SubmitButton
              label={isSubmitting ? "Saving..." : "Save Candidate"}
            />
          </form.AppForm>
        </div>
      </form>
    </Card>
  );
}
