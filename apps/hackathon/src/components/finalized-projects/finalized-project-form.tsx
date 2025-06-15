"use client";

import { z } from "zod";
import { Button, Card, useAppForm } from "@j5/component-library";
import { CreateFinalizedProjectSchema } from "../../server/zod/finalized-project";

// Define the schema for the form values, picking only title and description
const FinalizedProjectFormSchema = CreateFinalizedProjectSchema.pick({
  title: true,
  description: true,
});

// Infer the type for the form values
type FinalizedProjectFormValues = z.infer<typeof FinalizedProjectFormSchema>;

export type FinalizedProjectFormProps = {
  defaultData?: FinalizedProjectFormValues;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onSubmit: (data: FinalizedProjectFormValues) => Promise<boolean>;
  submitButtonLabel?: string;
};

export function FinalizedProjectForm({
  defaultData,
  onCancel,
  onSubmit,
  isSubmitting = false,
  submitButtonLabel = "Create Finalized Project",
}: FinalizedProjectFormProps) {
  const form = useAppForm({
    defaultValues: defaultData ?? {
      title: "",
      description: "",
    },
    validators: {
      onChange: ({ value }) => {
        const results = FinalizedProjectFormSchema.safeParse(value);
        if (!results.success) {
          console.log(results.error.flatten().fieldErrors);
          return results.error.flatten().fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      const result = await onSubmit(value);
      if (result) {
        form.reset();
      }
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
                placeholder="Enter the finalized project title"
                disabled={isSubmitting}
              />
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => (
              <field.FieldTextarea
                label="Project Description"
                placeholder="Describe the finalized project in detail"
                rows={6}
                disabled={isSubmitting}
                resize="vertical"
              />
            )}
          </form.AppField>

          <form.AppForm>
            <form.SubmitButton
              label={isSubmitting ? "Creating..." : submitButtonLabel}
            />
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                dataTestId="finalized-project-form-cancel-button"
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
