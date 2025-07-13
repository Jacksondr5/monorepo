"use client";

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  useAppForm,
} from "@j5/component-library";
import { Button } from "@j5/component-library";
import { Card } from "@j5/component-library";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  CreateCandidateSchema,
  UpdateCandidateSchema,
} from "../../server/zod/candidate";
import { z } from "zod";

type AcceptableSchemas =
  | typeof CreateCandidateSchema
  | typeof UpdateCandidateSchema;

export type CandidateFormProps<T extends AcceptableSchemas> = {
  initialData?: Omit<z.infer<T>, "organizationId">;
  onSubmit: (data: z.infer<T>) => Promise<void> | void;
  isSubmitting?: boolean;
  organizationId: string;
  schema: T;
};

export function CandidateForm<T extends AcceptableSchemas>({
  initialData,
  onSubmit,
  isSubmitting = false,
  organizationId,
  schema,
}: CandidateFormProps<T>) {
  const form = useAppForm({
    defaultValues: initialData,
    validators: {
      onChange: ({ value }) => {
        const results = schema.safeParse(value);
        if (!results.success) {
          const flatErrors = results.error.flatten().fieldErrors;
          console.log(flatErrors);
          return flatErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      const data = schema.parse(value);
      await onSubmit(data);
    },
  });

  const seniorities =
    useQuery(api.seniorities.getSeniorities, { orgId: organizationId }) || [];
  const sources =
    useQuery(api.sources.getSources, { orgId: organizationId }) || [];
  const kanbanStages =
    useQuery(api.kanbanStages.getKanbanStages, { orgId: organizationId }) || [];
  const roles = useQuery(api.roles.getRoles, { orgId: organizationId }) || [];
  const targetTeams =
    useQuery(api.targetTeams.getTargetTeams, { orgId: organizationId }) || [];

  return (
    <Card className="w-full p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className="flex gap-6">
          {/* Left column */}
          <div className="flex w-full flex-col gap-6">
            <form.AppField name="name">
              {(field) => <field.FieldInput label="Name" />}
            </form.AppField>

            <form.AppField name="location">
              {(field) => <field.FieldInput label="Location" />}
            </form.AppField>
            <form.AppField name="email">
              {(field) => <field.FieldInput type="email" label="Email" />}
            </form.AppField>
            <form.AppField name="phone">
              {(field) => <field.FieldInput type="tel" label="Phone" />}
            </form.AppField>
            <form.AppField name="salaryExpectations">
              {(field) => <field.FieldInput label="Salary Expectations" />}
            </form.AppField>
            <form.AppField name="startDate">
              {(field) => (
                <field.FieldDatePicker label="Start Date" className="w-full" />
              )}
            </form.AppField>
          </div>

          {/* Right column */}
          <div className="flex w-full flex-col gap-6">
            <form.AppField name="kanbanStageId">
              {(field) => (
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
            </form.AppField>
            <form.AppField name="type">
              {(field) => (
                <field.FieldSelect label="Type">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                  </SelectContent>
                </field.FieldSelect>
              )}
            </form.AppField>
            <form.AppField name="sourceId">
              {(field) => (
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
            </form.AppField>

            <form.AppField name="roleId">
              {(field) => (
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
            </form.AppField>

            <form.AppField name="seniorityId">
              {(field) => (
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
            </form.AppField>

            <form.AppField name="targetTeamId">
              {(field) => (
                <field.FieldSelect label="Target Team">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a target team" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetTeams.map((team) => (
                      <SelectItem key={team._id} value={team._id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </field.FieldSelect>
              )}
            </form.AppField>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          <form.AppField name="nextSteps">
            {(field) => (
              <field.FieldTextarea
                label="Next Steps"
                className="col-span-2 max-w-none"
              />
            )}
          </form.AppField>
        </div>
        {/* TODO: Resume upload functionality - planned for future release (JAC-52) */}
        {/* <div className="space-y-2">
          <label className="text-slate-12 text-sm font-medium">Resume</label>
        </div> */}
        <div className="flex justify-end gap-3 pt-4">
          <form.AppForm>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                // TODO: implement (JAC-52)
                console.log("cancelled");
              }}
              dataTestId="candidate-form-cancel-button"
            >
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
