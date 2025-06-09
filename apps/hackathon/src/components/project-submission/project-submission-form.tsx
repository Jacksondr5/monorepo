"use client";

import { z } from "zod";
import { Button, Card, useAppForm } from "@j5/component-library";
import { CreateProjectSchema } from "../../server/zod/project";

// Define the schema for the form values, picking only title and description
const ProjectSubmissionFormSchema = CreateProjectSchema.pick({
  title: true,
  description: true,
});

// Infer the type for the form values
type ProjectSubmissionFormValues = z.infer<typeof ProjectSubmissionFormSchema>;

export type ProjectSubmissionFormProps = {
  defaultData?: ProjectSubmissionFormValues;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onSubmit: (data: ProjectSubmissionFormValues) => Promise<void> | void;
  submitButtonLabel?: string;
};

export function ProjectSubmissionForm({
  defaultData,
  onCancel,
  onSubmit,
  isSubmitting = false,
  submitButtonLabel = "Submit Project",
}: ProjectSubmissionFormProps) {
  const form = useAppForm({
    defaultValues: defaultData ?? {
      title: "",
      description: "",
    },
    validators: {
      onChange: ({ value }) => {
        const results = ProjectSubmissionFormSchema.safeParse(value);
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

  return (
    <Card className="w-full max-w-2xl p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-6">
          <form.AppField name="title">
            {(field) => (
              <field.FieldInput
                label="Project Title"
                placeholder="Enter a catchy title for your project"
                disabled={isSubmitting}
              />
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => (
              <field.FieldTextarea
                label="Project Description"
                placeholder="Describe your project idea in detail"
                rows={6}
                disabled={isSubmitting}
                resize="vertical"
              />
            )}
          </form.AppField>

          {/* TODO: Add image upload functionality here */}
          <p className="text-slate-9 text-sm">
            Image uploads will be supported soon.
          </p>
          <form.AppForm>
            <form.SubmitButton
              label={isSubmitting ? "Submitting..." : submitButtonLabel}
            />
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                dataTestId="project-submission-cancel-button"
              >
                Cancel
              </Button>
            )}
          </form.AppForm>
        </div>
      </form>
    </Card>
  );
}
