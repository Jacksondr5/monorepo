import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, userEvent, within, expect } from "storybook/test";
import React from "react";
import { ProjectSubmissionForm } from "./project-submission-form";

const meta: Meta<typeof ProjectSubmissionForm> = {
  title: "Hackathon/Components/ProjectSubmission/ProjectSubmissionForm",
  component: ProjectSubmissionForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onSubmit: { action: "submitted" },
    onCancel: { action: "cancelled" },
    isSubmitting: { control: "boolean" },
    submitButtonLabel: { control: "text" },
  },
  args: {
    onSubmit: fn().mockResolvedValue(true),
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Visual Matrix Story - covers all static visual combinations
export const AllVariants: Story = {
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  render: (args) => {
    const sampleData = {
      title: "AI-Powered Code Assistant",
      description:
        "A sophisticated AI assistant that helps developers write better code through intelligent suggestions, automated testing, and real-time collaboration features.",
    };

    return (
      <div className="flex flex-col gap-8 p-6">
        {/* Empty Form States */}
        <div>
          <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
            Empty Form States
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                Default (Submit only)
              </h3>
              <ProjectSubmissionForm {...args} onCancel={undefined} />
            </div>
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                With Cancel Button
              </h3>
              <ProjectSubmissionForm
                {...args}
                onCancel={fn()}
                isSubmitting={false}
              />
            </div>
          </div>
        </div>

        {/* Filled Form States */}
        <div>
          <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
            Filled Form States
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                Ready to Submit
              </h3>
              <ProjectSubmissionForm
                {...args}
                defaultData={sampleData}
                submitButtonLabel="Submit Project"
                isSubmitting={false}
              />
            </div>
          </div>
        </div>

        {/* Loading/Submitting States */}
        <div>
          <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
            Loading States
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                Submitting
              </h3>
              <ProjectSubmissionForm
                {...args}
                defaultData={sampleData}
                isSubmitting={true}
                onCancel={undefined}
              />
            </div>
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                Submitting with Cancel
              </h3>
              <ProjectSubmissionForm
                {...args}
                defaultData={sampleData}
                onCancel={fn()}
                isSubmitting={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
  args: {
    // Visual matrix doesn't need specific args, uses render function
  },
};

// Interaction Stories for testing dynamic behavior

export const FormSubmission: Story = {
  name: "Test: Form Submission Flow",
  args: {
    isSubmitting: false,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Fill out the form", async () => {
      // Fill in the title field using data-testid
      const titleInput = canvas.getByTestId("title-input");
      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, "My Test Project");

      // Fill in the description field using data-testid
      const descriptionInput = canvas.getByTestId("description-textarea");
      await userEvent.clear(descriptionInput);
      await userEvent.type(
        descriptionInput,
        "This is a comprehensive test of the project submission form functionality.",
      );

      // Verify fields are filled
      expect(titleInput).toHaveValue("My Test Project");
      expect(descriptionInput).toHaveValue(
        "This is a comprehensive test of the project submission form functionality.",
      );
    });

    await step("Submit the form", async () => {
      const submitButton = canvas.getByTestId("submit-button");
      expect(submitButton).toBeEnabled();

      await userEvent.click(submitButton);

      // Verify onSubmit was called with correct data
      expect(args.onSubmit).toHaveBeenCalledWith({
        title: "My Test Project",
        description:
          "This is a comprehensive test of the project submission form functionality.",
      });
    });
  },
};

export const CancelFunctionality: Story = {
  name: "Test: Cancel Button",
  args: {
    onCancel: fn(),
    submitButtonLabel: "Save Draft",
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Fill out form partially", async () => {
      const titleInput = canvas.getByTestId("title-input");
      await userEvent.type(titleInput, "Draft Project");
      expect(titleInput).toHaveValue("Draft Project");
    });

    await step("Click cancel button", async () => {
      const cancelButton = canvas.getByTestId(
        "project-submission-cancel-button",
      );
      expect(cancelButton).toBeInTheDocument();

      await userEvent.click(cancelButton);

      // Verify onCancel was called
      expect(args.onCancel).toHaveBeenCalledTimes(1);
    });
  },
};

export const FormValidation: Story = {
  name: "Test: Form Validation",
  args: {
    isSubmitting: false,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Test empty form submission", async () => {
      const submitButton = canvas.getByTestId("submit-button");

      // Try to submit empty form (button might be disabled, so use pointerEventsCheck: 0)
      await userEvent.click(submitButton, { pointerEventsCheck: 0 });

      // onSubmit should not be called with invalid data
      expect(args.onSubmit).not.toHaveBeenCalled();
    });

    await step("Test partial form completion", async () => {
      // Fill only title
      const titleInput = canvas.getByTestId("title-input");
      await userEvent.type(titleInput, "Just a title");

      const submitButton = canvas.getByTestId("submit-button");
      await userEvent.click(submitButton, { pointerEventsCheck: 0 });

      // Should still not submit with incomplete data
      expect(args.onSubmit).not.toHaveBeenCalled();
    });

    await step("Test complete valid form", async () => {
      // Now fill description too
      const descriptionInput = canvas.getByTestId("description-textarea");
      await userEvent.type(descriptionInput, "Now with a description");

      const submitButton = canvas.getByTestId("submit-button");
      await userEvent.click(submitButton);

      // Now it should submit
      expect(args.onSubmit).toHaveBeenCalledWith({
        title: "Just a title",
        description: "Now with a description",
      });
    });
  },
};

export const SubmittingState: Story = {
  name: "Test: Submitting State Behavior",
  args: {
    defaultData: {
      title: "Test Project",
      description: "Testing the submitting state",
    },
    isSubmitting: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify form is disabled during submission", async () => {
      // All inputs should be disabled
      const titleInput = canvas.getByTestId("title-input");
      const descriptionInput = canvas.getByTestId("description-textarea");

      expect(titleInput).toBeDisabled();
      expect(descriptionInput).toBeDisabled();

      // Submit button should show loading state
      const submitButton = canvas.getByTestId("submit-button");
      expect(submitButton).toHaveTextContent("Submitting...");
    });
  },
};

export const KeyboardNavigation: Story = {
  name: "Test: Keyboard Navigation",
  args: {
    onCancel: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Navigate through form with keyboard", async () => {
      // Start from title input
      const titleInput = canvas.getByTestId("title-input");
      titleInput.focus();
      expect(titleInput).toHaveFocus();

      // Tab to description
      await userEvent.tab();
      const descriptionInput = canvas.getByTestId("description-textarea");
      expect(descriptionInput).toHaveFocus();

      // Tab to submit button
      await userEvent.tab();
      const submitButton = canvas.getByTestId("submit-button");
      expect(submitButton).toHaveFocus();

      // Tab to cancel button
      await userEvent.tab();
      const cancelButton = canvas.getByTestId(
        "project-submission-cancel-button",
      );
      expect(cancelButton).toHaveFocus();
    });
  },
};
