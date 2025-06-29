import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import React from "react";
import { FinalizedProjectForm } from "./finalized-project-form";

type Story = StoryObj<typeof FinalizedProjectForm>;

// Mock functions for testing
const mockOnSubmit = fn(async () => true);
const mockOnCancel = fn();

const meta: Meta<typeof FinalizedProjectForm> = {
  title: "Hackathon/Components/FinalizedProjects/FinalizedProjectForm",
  component: FinalizedProjectForm,
  parameters: {
    layout: "centered",
  },
  args: {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    isSubmitting: false,
  },
  beforeEach() {
    // Reset mocks before each story
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  },
};

export default meta;

// Visual Matrix Tests
export const AllVariants: Story = {
  name: "Visual Matrix: All Form States",
  render: (args) => (
    <div className="space-y-8">
      <div>
        <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
          Form States
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">Default</h3>
            <FinalizedProjectForm
              {...args}
              onSubmit={mockOnSubmit}
              onCancel={mockOnCancel}
              isSubmitting={false}
            />
          </div>
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Submitting
            </h3>
            <FinalizedProjectForm
              {...args}
              onSubmit={mockOnSubmit}
              onCancel={mockOnCancel}
              isSubmitting={true}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

// Interaction Tests
export const FormSubmission: Story = {
  name: "Test: Form Submission Flow",
  args: {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    isSubmitting: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Fill out the form", async () => {
      const titleInput = canvas.getByTestId("title-input");
      const descriptionInput = canvas.getByTestId("description-textarea");

      await userEvent.type(titleInput, "My Finalized Project");
      await userEvent.type(
        descriptionInput,
        "This is a comprehensive description of the finalized project.",
      );

      expect(titleInput).toHaveValue("My Finalized Project");
      expect(descriptionInput).toHaveValue(
        "This is a comprehensive description of the finalized project.",
      );
    });

    await step("Submit the form", async () => {
      const submitButton = canvas.getByTestId("submit-button");
      await userEvent.click(submitButton);

      // Verify onSubmit was called with correct data
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "My Finalized Project",
        description:
          "This is a comprehensive description of the finalized project.",
      });
    });

    await step("Verify form is reset after successful submission", async () => {
      // Form should be reset after successful submission
      const titleInput = canvas.getByTestId("title-input");
      const descriptionInput = canvas.getByTestId("description-textarea");

      expect(titleInput).toHaveValue("");
      expect(descriptionInput).toHaveValue("");
    });
  },
};

export const FormValidation: Story = {
  name: "Test: Form Validation",
  args: {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    isSubmitting: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Test empty form submission", async () => {
      const submitButton = canvas.getByTestId("submit-button");

      // Try to submit empty form (button might be disabled, so use pointerEventsCheck: 0)
      await userEvent.click(submitButton, { pointerEventsCheck: 0 });

      // onSubmit should not be called with invalid data
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    await step("Test partial form completion", async () => {
      // Fill only title
      const titleInput = canvas.getByTestId("title-input");
      await userEvent.type(titleInput, "Just a title");

      const submitButton = canvas.getByTestId("submit-button");
      await userEvent.click(submitButton, { pointerEventsCheck: 0 });

      // Should still not submit with incomplete data
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    await step("Test complete valid form", async () => {
      // Now fill description too
      const descriptionInput = canvas.getByTestId("description-textarea");
      await userEvent.type(descriptionInput, "Now with a description");

      const submitButton = canvas.getByTestId("submit-button");
      await userEvent.click(submitButton);

      // Now it should submit
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Just a title",
        description: "Now with a description",
      });
    });
  },
};

export const SubmittingState: Story = {
  name: "Test: Submitting State Behavior",
  args: {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    isSubmitting: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify form is disabled during submission", async () => {
      // All inputs should be disabled
      const titleInput = canvas.getByTestId("title-input");
      const descriptionInput = canvas.getByTestId("description-textarea");
      const cancelButton = canvas.getByTestId(
        "finalized-project-form-cancel-button",
      );

      expect(titleInput).toBeDisabled();
      expect(descriptionInput).toBeDisabled();
      expect(cancelButton).toBeDisabled();

      // Submit button should show loading state
      const submitButton = canvas.getByTestId("submit-button");
      expect(submitButton).toHaveTextContent("Creating...");
    });
  },
};

export const CancelButton: Story = {
  name: "Test: Cancel Button",
  args: {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    isSubmitting: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify cancel button is present and enabled", async () => {
      const cancelButton = canvas.getByTestId(
        "finalized-project-form-cancel-button",
      );
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton).toHaveTextContent("Cancel");
      expect(cancelButton).toBeEnabled();
    });

    await step("Click cancel button", async () => {
      const cancelButton = canvas.getByTestId(
        "finalized-project-form-cancel-button",
      );
      await userEvent.click(cancelButton);

      // Verify onCancel was called
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  },
};

export const FailedSubmission: Story = {
  name: "Test: Failed Submission Handling",
  args: {
    onSubmit: fn(async () => false), // Return false to indicate failure
    onCancel: mockOnCancel,
    isSubmitting: false,
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step("Fill out the form", async () => {
      const titleInput = canvas.getByTestId("title-input");
      const descriptionInput = canvas.getByTestId("description-textarea");

      await userEvent.type(titleInput, "Test Project");
      await userEvent.type(descriptionInput, "Test description");

      expect(titleInput).toHaveValue("Test Project");
      expect(descriptionInput).toHaveValue("Test description");
    });

    await step("Submit form and verify no reset on failure", async () => {
      const submitButton = canvas.getByTestId("submit-button");
      await userEvent.click(submitButton);

      // Verify onSubmit was called
      expect(args.onSubmit).toHaveBeenCalledWith({
        title: "Test Project",
        description: "Test description",
      });

      // Form should NOT be reset after failed submission
      const titleInput = canvas.getByTestId("title-input");
      const descriptionInput = canvas.getByTestId("description-textarea");

      expect(titleInput).toHaveValue("Test Project");
      expect(descriptionInput).toHaveValue("Test description");
    });
  },
};
